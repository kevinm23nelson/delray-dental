// src/app/api/available-slots/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, AppointmentStatus, DayOfWeek } from "@prisma/client";
import { addMinutes, parseISO, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

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

    // Parse the requested date and ensure it's in Eastern Time
    const utcDate = parseISO(dateStr);
    const dateET = toZonedTime(utcDate, TIMEZONE);
    const formattedDateET = format(dateET, "yyyy-MM-dd");

    console.log("Date for scheduling (ET):", formattedDateET);

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

    // Find existing appointments for the day
    // We'll query in a way that doesn't need timezone conversion
    const startOfDay = `${formattedDateET}T00:00:00-04:00`; // Eastern Time with offset
    const endOfDay = `${formattedDateET}T23:59:59-04:00`; // Eastern Time with offset

    console.log("Searching for appointments between:", {
      startOfDay,
      endOfDay,
    });

    const practitionerAppointments = new Map<string, ExistingAppointment[]>();

    for (const practitioner of practitioners) {
      const appointments = await prisma.appointment.findMany({
        where: {
          practitionerId: practitioner.id,
          startTime: {
            gte: new Date(startOfDay),
            lt: new Date(endOfDay),
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

      // Convert to Eastern Time for consistency
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

      // Parse the schedule times
      const scheduleStartET = parseISO(
        `${formattedDateET}T${schedule.startTime}`
      );
      const scheduleEndET = parseISO(`${formattedDateET}T${schedule.endTime}`);

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
            `${formattedDateET}T${schedule.breakStart}`
          );
          const breakEndET = parseISO(
            `${formattedDateET}T${schedule.breakEnd}`
          );

          isBreakTime =
            currentTimeET >= breakStartET && slotEndTimeET <= breakEndET;
        }

        if (!hasConflict && !isBreakTime) {
          // Format times for display
          const slotTime = format(currentTimeET, "h:mm a");
          const slotEndTime = format(slotEndTimeET, "h:mm a");

          // Create ISO strings with explicit ET timezone (-04:00)
          const startTimeISOWithOffset = format(
            currentTimeET,
            "yyyy-MM-dd'T'HH:mm:ss.SSS'-04:00'"
          );
          const endTimeISOWithOffset = format(
            slotEndTimeET,
            "yyyy-MM-dd'T'HH:mm:ss.SSS'-04:00'"
          );

          console.log("Creating slot:", {
            displayTime: slotTime,
            displayEndTime: slotEndTime,
            startTimeET: startTimeISOWithOffset,
            endTimeET: endTimeISOWithOffset,
          });

          availableSlots.push({
            displayTime: slotTime,
            displayEndTime: slotEndTime,
            // Include timezone offset in the ISO string
            startTime: startTimeISOWithOffset,
            endTime: endTimeISOWithOffset,
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
