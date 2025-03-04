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

    // Parse the requested date (it comes in as UTC from client)
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
    
    // Convert to UTC for database query by using formatInTimeZone
    const startOfDayUTC = new Date(
      formatInTimeZone(startOfDayET, TIMEZONE, "yyyy-MM-dd'T'00:00:00.000'Z'")
    );
    
    const endOfDayUTC = new Date(
      formatInTimeZone(endOfDayET, TIMEZONE, "yyyy-MM-dd'T'23:59:59.999'Z'")
    );
    
    console.log("Searching for appointments between:", {
      startOfDayET: format(startOfDayET, "yyyy-MM-dd'T'HH:mm:ss"),
      endOfDayET: format(endOfDayET, "yyyy-MM-dd'T'HH:mm:ss"),
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
      
      // Convert the UTC times from the database to Eastern Time for comparison
      const appointmentsET = appointments.map(appt => ({
        startTime: toZonedTime(appt.startTime, TIMEZONE),
        endTime: toZonedTime(appt.endTime, TIMEZONE)
      }));
      
      practitionerAppointments.set(practitioner.id, appointmentsET);
      console.log(
        `Found ${appointments.length} appointments for practitioner ${practitioner.name}`,
        appointments.map(a => ({
          startTime: a.startTime.toISOString(),
          endTime: a.endTime.toISOString(),
          startTimeET: format(toZonedTime(a.startTime, TIMEZONE), "HH:mm"),
          endTimeET: format(toZonedTime(a.endTime, TIMEZONE), "HH:mm"),
        }))
      );
    }

    const availableSlots = [];

    for (const practitioner of practitioners) {
      const schedule = practitioner.schedule[0];
      if (!schedule) {
        console.log(`No schedule found for practitioner ${practitioner.name}`);
        continue;
      }

      // Create complete date objects for the schedule in Eastern Time
      // This combines the date (from dateET) with the time strings from the schedule
      const scheduleDateStr = format(dateET, "yyyy-MM-dd");
      
      // Parse the strings to create proper date objects in Eastern Time
      const scheduleStartET = parseISO(`${scheduleDateStr}T${schedule.startTime}`);
      const scheduleEndET = parseISO(`${scheduleDateStr}T${schedule.endTime}`);
      
      console.log(`Schedule for ${practitioner.name}:`, {
        dayOfWeek: schedule.dayOfWeek,
        timeRange: `${schedule.startTime} - ${schedule.endTime}`,
        scheduleStartET: format(scheduleStartET, "HH:mm"),
        scheduleEndET: format(scheduleEndET, "HH:mm"),
      });
      
      let currentTimeET = scheduleStartET;

      const practitionerExistingAppointments =
        practitionerAppointments.get(practitioner.id) || [];

      while (currentTimeET < scheduleEndET) {
        const slotEndTimeET = addMinutes(currentTimeET, appointmentType.duration);

        const hasConflict = practitionerExistingAppointments.some(
          (appt: ExistingAppointment) => {
            // All times are in ET for this comparison
            return (
              (currentTimeET >= appt.startTime && currentTimeET < appt.endTime) ||
              (slotEndTimeET > appt.startTime && slotEndTimeET <= appt.endTime) ||
              (currentTimeET <= appt.startTime && slotEndTimeET >= appt.endTime)
            );
          }
        );

        let isBreakTime = false;
        if (schedule.breakStart && schedule.breakEnd) {
          const breakStartET = parseISO(`${scheduleDateStr}T${schedule.breakStart}`);
          const breakEndET = parseISO(`${scheduleDateStr}T${schedule.breakEnd}`);
          
          isBreakTime = 
            currentTimeET >= breakStartET && 
            slotEndTimeET <= breakEndET;
        }

        if (!hasConflict && !isBreakTime) {
          // Convert Eastern Time slots to UTC for database storage compatibility
          // We use formatInTimeZone to get the UTC representation of the Eastern Time
          const startTimeUTC = new Date(
            formatInTimeZone(currentTimeET, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
          );
          
          const endTimeUTC = new Date(
            formatInTimeZone(slotEndTimeET, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
          );
          
          availableSlots.push({
            startTime: startTimeUTC.toISOString(),
            endTime: endTimeUTC.toISOString(),
            practitionerId: practitioner.id,
            practitionerName: practitioner.name,
          });
        }

        currentTimeET = addMinutes(currentTimeET, appointmentType.duration);
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

    console.log(`Returning ${availableSlots.length} available slots`, 
      availableSlots.map(slot => ({
        time: `${format(toZonedTime(new Date(slot.startTime), TIMEZONE), "HH:mm")} - ${format(toZonedTime(new Date(slot.endTime), TIMEZONE), "HH:mm")}`,
        practitioner: slot.practitionerName
      }))
    );
    
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