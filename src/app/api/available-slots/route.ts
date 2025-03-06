// src/app/api/available-slots/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, AppointmentStatus, DayOfWeek } from "@prisma/client";
import { addMinutes, parseISO, format } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const prisma = new PrismaClient();
const TIMEZONE = "America/New_York"; // Eastern Time

interface ExistingAppointment {
  startTime: Date;
  endTime: Date;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    const appointmentTypeId = searchParams.get("appointmentTypeId");

    console.log("Query params:", { dateStr, appointmentTypeId });

    if (!dateStr || !appointmentTypeId) {
      console.log("Missing required parameters");
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Parse the requested date
    const utcDate = parseISO(dateStr);

    // Convert to Eastern Time for business logic
    const dateET = toZonedTime(utcDate, TIMEZONE);
    console.log("Date in ET:", format(dateET, "yyyy-MM-dd"));

    const appointmentType = await prisma.appointmentType.findUnique({
      where: { id: appointmentTypeId },
    });

    if (!appointmentType) {
      console.log("Appointment type not found:", appointmentTypeId);
      return NextResponse.json(
        { error: "Appointment type not found" },
        { status: 404 }
      );
    }

    // Get day of week in Eastern Time
    const dayOfWeek = format(dateET, "EEEE").toUpperCase() as DayOfWeek;
    console.log("Day of week (ET):", dayOfWeek);

    const practitioners = await prisma.practitioner.findMany({
      where: {
        isActive: true,
        role: { in: appointmentType.allowedRoles },
      },
      include: {
        schedule: {
          where: {
            dayOfWeek,
            isAvailable: true,
          },
        },
      },
    });

    console.log(`Found ${practitioners.length} practitioners`);

    // Create start and end of day in Eastern Time
    const startOfDayET = new Date(dateET);
    startOfDayET.setHours(0, 0, 0, 0);

    const endOfDayET = new Date(dateET);
    endOfDayET.setHours(23, 59, 59, 999);

    // Convert to UTC for database query
    const startOfDayUTC = parseISO(
      formatInTimeZone(startOfDayET, TIMEZONE, "yyyy-MM-dd'T'00:00:00.000'Z'")
    );

    const endOfDayUTC = parseISO(
      formatInTimeZone(endOfDayET, TIMEZONE, "yyyy-MM-dd'T'23:59:59.999'Z'")
    );

    console.log("Searching for appointments between:", {
      startOfDayUTC: startOfDayUTC.toISOString(),
      endOfDayUTC: endOfDayUTC.toISOString(),
    });

    const practitionerAppointments = new Map<string, ExistingAppointment[]>();

    for (const practitioner of practitioners) {
      const appointments = await prisma.appointment.findMany({
        where: {
          practitionerId: practitioner.id,
          startTime: {
            gte: startOfDayUTC,
            lt: endOfDayUTC,
          },
          status: {
            in: [AppointmentStatus.PENDING, AppointmentStatus.SCHEDULED],
          },
        },
        select: {
          startTime: true,
          endTime: true,
        },
      });

      // Convert the UTC times from the database to Eastern Time for comparison
      const appointmentsET = appointments.map((appt) => ({
        startTime: toZonedTime(appt.startTime, TIMEZONE),
        endTime: toZonedTime(appt.endTime, TIMEZONE),
      }));

      practitionerAppointments.set(practitioner.id, appointmentsET);
    }

    const availableSlots = [];

    for (const practitioner of practitioners) {
      const schedule = practitioner.schedule[0];
      if (!schedule) {
        console.log(`No schedule found for practitioner ${practitioner.name}`);
        continue;
      }

      // Create date objects for the schedule in Eastern Time
      const scheduleDateStr = format(dateET, "yyyy-MM-dd");

      // Parse the strings to create proper date objects in Eastern Time
      const scheduleStartET = parseISO(
        `${scheduleDateStr}T${schedule.startTime}`
      );
      const scheduleEndET = parseISO(`${scheduleDateStr}T${schedule.endTime}`);

      console.log(`Schedule for ${practitioner.name}:`, {
        timeRange: `${schedule.startTime} - ${schedule.endTime}`,
      });

      let currentTimeET = scheduleStartET;

      const practitionerExistingAppointments =
        practitionerAppointments.get(practitioner.id) || [];

      while (currentTimeET < scheduleEndET) {
        const slotEndTimeET = addMinutes(
          currentTimeET,
          appointmentType.duration
        );

        const hasConflict = practitionerExistingAppointments.some(
          (appt: ExistingAppointment) => {
            return (
              (currentTimeET >= appt.startTime &&
                currentTimeET < appt.endTime) ||
              (slotEndTimeET > appt.startTime &&
                slotEndTimeET <= appt.endTime) ||
              (currentTimeET <= appt.startTime && slotEndTimeET >= appt.endTime)
            );
          }
        );

        let isBreakTime = false;
        if (schedule.breakStart && schedule.breakEnd) {
          const breakStartET = parseISO(
            `${scheduleDateStr}T${schedule.breakStart}`
          );
          const breakEndET = parseISO(
            `${scheduleDateStr}T${schedule.breakEnd}`
          );

          isBreakTime =
            currentTimeET >= breakStartET && slotEndTimeET <= breakEndET;
        }

        if (!hasConflict && !isBreakTime) {
          // IMPORTANT: Here we create a *metadata representation* for display purposes
          // We don't try to convert between timezones for display
          const slotTime = format(currentTimeET, "h:mm a");
          const slotEndTime = format(slotEndTimeET, "h:mm a");

          // We also need to store the actual UTC time for database storage
          const utcStartTime = parseISO(
            formatInTimeZone(
              currentTimeET,
              TIMEZONE,
              "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
            )
          );
          const utcEndTime = parseISO(
            formatInTimeZone(
              slotEndTimeET,
              TIMEZONE,
              "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
            )
          );

          availableSlots.push({
            displayTime: slotTime,
            displayEndTime: slotEndTime,
            startTime: utcStartTime.toISOString(),
            endTime: utcEndTime.toISOString(),
            practitionerId: practitioner.id,
            practitionerName: practitioner.name,
            // Add these for sorting
            hour: currentTimeET.getHours(),
            minute: currentTimeET.getMinutes(),
          });
        }

        currentTimeET = addMinutes(currentTimeET, appointmentType.duration);
      }
    }

    availableSlots.sort((a, b) => {
      // Sort by hour first
      if (a.hour !== b.hour) {
        return a.hour - b.hour;
      }

      // If hours match, sort by minute
      if (a.minute !== b.minute) {
        return a.minute - b.minute;
      }

      // If times match exactly, sort by practitioner name
      return a.practitionerName.localeCompare(b.practitionerName);
    });

    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error("Failed to get available slots:", error);
    return NextResponse.json(
      {
        error: "Failed to get available slots",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
