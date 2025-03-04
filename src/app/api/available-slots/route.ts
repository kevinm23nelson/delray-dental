// src/app/api/available-slots/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, AppointmentStatus, DayOfWeek } from "@prisma/client";
import { addMinutes, parseISO, format } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const prisma = new PrismaClient();
const TIMEZONE = 'America/New_York'; // Eastern Time

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

    // Parse the date and convert to Eastern Time for consistency
    const utcDate = parseISO(dateStr);
    const dateET = toZonedTime(utcDate, TIMEZONE);
    console.log("Parsed date (ET):", dateET);

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
    const startOfDayUTC = new Date(
      formatInTimeZone(startOfDayET, TIMEZONE, "yyyy-MM-dd'T'00:00:00.000'Z'")
    );
    const endOfDayUTC = new Date(
      formatInTimeZone(endOfDayET, TIMEZONE, "yyyy-MM-dd'T'23:59:59.999'Z'")
    );

    console.log("Searching for appointments between:", {
      startOfDayUTC: startOfDayUTC.toISOString(),
      endOfDayUTC: endOfDayUTC.toISOString()
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
      
      // Convert the UTC times from the database to Eastern Time
      const appointmentsET = appointments.map(appt => ({
        startTime: toZonedTime(appt.startTime, TIMEZONE),
        endTime: toZonedTime(appt.endTime, TIMEZONE)
      }));
      
      practitionerAppointments.set(practitioner.id, appointmentsET);
      console.log(
        `Found ${appointments.length} appointments for practitioner ${practitioner.name}`
      );
    }

    const availableSlots = [];

    for (const practitioner of practitioners) {
      const schedule = practitioner.schedule[0];
      if (!schedule) {
        console.log(`No schedule found for practitioner ${practitioner.name}`);
        continue;
      }

      // Create date objects for the schedule start and end times in Eastern Time
      const startTime = parseISO(
        `${format(dateET, "yyyy-MM-dd")}T${schedule.startTime}`
      );
      const endTime = parseISO(
        `${format(dateET, "yyyy-MM-dd")}T${schedule.endTime}`
      );
      
      console.log(`Schedule for ${practitioner.name}:`, {
        startTimeET: format(startTime, "yyyy-MM-dd'T'HH:mm:ss"),
        endTimeET: format(endTime, "yyyy-MM-dd'T'HH:mm:ss")
      });
      
      let currentTime = startTime;

      const practitionerExistingAppointments =
        practitionerAppointments.get(practitioner.id) || [];

      while (currentTime < endTime) {
        const slotEndTime = addMinutes(currentTime, appointmentType.duration);

        const hasConflict = practitionerExistingAppointments.some(
          (appt: ExistingAppointment) => {
            const apptStart = new Date(appt.startTime);
            const apptEnd = new Date(appt.endTime);
            
            return (
              (currentTime >= apptStart && currentTime < apptEnd) ||
              (slotEndTime > apptStart && slotEndTime <= apptEnd) ||
              (currentTime <= apptStart && slotEndTime >= apptEnd)
            );
          }
        );

        const isBreakTime =
          schedule.breakStart &&
          schedule.breakEnd &&
          currentTime >=
            parseISO(`${format(dateET, "yyyy-MM-dd")}T${schedule.breakStart}`) &&
          slotEndTime <=
            parseISO(`${format(dateET, "yyyy-MM-dd")}T${schedule.breakEnd}`);

        if (!hasConflict && !isBreakTime) {
          // Convert Eastern Time slots to UTC for API response
          const startTimeUTC = new Date(
            formatInTimeZone(currentTime, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
          );
          const endTimeUTC = new Date(
            formatInTimeZone(slotEndTime, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
          );
          
          availableSlots.push({
            startTime: startTimeUTC.toISOString(),
            endTime: endTimeUTC.toISOString(),
            practitionerId: practitioner.id,
            practitionerName: practitioner.name,
          });
        }

        currentTime = addMinutes(currentTime, appointmentType.duration);
      }
    }

    availableSlots.sort((a, b) => {
      const timeComparison =
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      if (timeComparison === 0) {
        return a.practitionerName.localeCompare(b.practitionerName);
      }
      return timeComparison;
    });

    console.log(`Returning ${availableSlots.length} available slots`);
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