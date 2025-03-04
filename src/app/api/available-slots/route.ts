// src/app/api/available-slots/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, AppointmentStatus, DayOfWeek } from "@prisma/client";
import { addMinutes, parseISO, format } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const prisma = new PrismaClient();
const TIMEZONE = 'America/New_York'; // Set this to your business timezone

interface ExistingAppointment {
  startTime: Date;
  endTime: Date;
}

// Helper function to convert a zoned time to UTC
function zonedTimeToUtc(date: Date, timeZone: string): Date {
  // Create a date string in the target timezone
  const dateString = formatInTimeZone(date, timeZone, "yyyy-MM-dd'T'HH:mm:ss.SSS");
  
  // Parse it as if it was UTC (no timezone shift)
  const localDate = new Date(dateString + 'Z');
  
  // Calculate timezone offset in minutes
  const targetTzDate = toZonedTime(new Date(), timeZone);
  const tzOffsetInMs = targetTzDate.getTimezoneOffset() * 60 * 1000;
  
  // Adjust for timezone offset
  return new Date(localDate.getTime() - tzOffsetInMs);
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

    // Parse the date parameter - this will be in client's timezone/UTC
    const date = parseISO(dateStr);
    console.log("Parsed date parameter:", date.toISOString());
    
    // Convert to business timezone for consistent handling
    const zonedDate = toZonedTime(date, TIMEZONE);
    console.log("Date in business timezone:", formatInTimeZone(zonedDate, TIMEZONE, "yyyy-MM-dd HH:mm:ss"));

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

    const dayOfWeek = format(zonedDate, "EEEE").toUpperCase() as DayOfWeek;
    console.log("Day of week:", dayOfWeek);

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

    // Set up day boundaries in business timezone
    const businessDateStr = format(zonedDate, "yyyy-MM-dd");
    const startOfDay = parseISO(`${businessDateStr}T00:00:00`);
    const endOfDay = parseISO(`${businessDateStr}T23:59:59.999`);
    
    // Convert to UTC for database queries
    const utcStartOfDay = zonedTimeToUtc(startOfDay, TIMEZONE);
    const utcEndOfDay = zonedTimeToUtc(endOfDay, TIMEZONE);

    console.log("Searching for appointments between:", {
      startOfDay: utcStartOfDay.toISOString(),
      endOfDay: utcEndOfDay.toISOString()
    });
    
    const practitionerAppointments = new Map<string, ExistingAppointment[]>();

    for (const practitioner of practitioners) {
      const appointments = await prisma.appointment.findMany({
        where: {
          practitionerId: practitioner.id,
          startTime: {
            gte: utcStartOfDay,
            lt: utcEndOfDay,
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
      
      practitionerAppointments.set(practitioner.id, appointments);
      console.log(
        `Found ${appointments.length} appointments for practitioner ${practitioner.name}:`,
        appointments.map(a => ({startTime: a.startTime.toISOString(), endTime: a.endTime.toISOString()}))
      );
    }

    const availableSlots = [];

    for (const practitioner of practitioners) {
      const schedule = practitioner.schedule[0];
      if (!schedule) {
        console.log(`No schedule found for practitioner ${practitioner.name}`);
        continue;
      }

      // Create time objects based on practitioner schedule in business timezone
      const scheduleStartTime = parseISO(`${businessDateStr}T${schedule.startTime}`);
      const scheduleEndTime = parseISO(`${businessDateStr}T${schedule.endTime}`);
      
      console.log(`Schedule for ${practitioner.name}:`, {
        rawStartTime: schedule.startTime,
        rawEndTime: schedule.endTime,
        scheduleStartTime: formatInTimeZone(scheduleStartTime, TIMEZONE, "yyyy-MM-dd HH:mm:ss"),
        scheduleEndTime: formatInTimeZone(scheduleEndTime, TIMEZONE, "yyyy-MM-dd HH:mm:ss")
      });
      
      let currentSlotTime = scheduleStartTime;
      const practitionerExistingAppointments = practitionerAppointments.get(practitioner.id) || [];

      while (currentSlotTime < scheduleEndTime) {
        const slotEndTime = addMinutes(currentSlotTime, appointmentType.duration);
        
        // Convert current slot time to UTC for comparison with database appointments
        const currentSlotTimeUTC = zonedTimeToUtc(currentSlotTime, TIMEZONE);
        const slotEndTimeUTC = zonedTimeToUtc(slotEndTime, TIMEZONE);

        const hasConflict = practitionerExistingAppointments.some(
          (appt: ExistingAppointment) => {
            const apptStart = new Date(appt.startTime);
            const apptEnd = new Date(appt.endTime);
            
            const conflict = (
              (currentSlotTimeUTC >= apptStart && currentSlotTimeUTC < apptEnd) ||
              (slotEndTimeUTC > apptStart && slotEndTimeUTC <= apptEnd) ||
              (currentSlotTimeUTC <= apptStart && slotEndTimeUTC >= apptEnd)
            );
            
            if (conflict) {
              console.log(`Conflict found for ${practitioner.name} at ${formatInTimeZone(currentSlotTime, TIMEZONE, "HH:mm")}`);
              console.log(`  Slot: ${currentSlotTimeUTC.toISOString()} - ${slotEndTimeUTC.toISOString()}`);
              console.log(`  Appt: ${apptStart.toISOString()} - ${apptEnd.toISOString()}`);
            }
            
            return conflict;
          }
        );

        // Check for lunch/break time
        let isBreakTime = false;
        if (schedule.breakStart && schedule.breakEnd) {
          const breakStart = parseISO(`${businessDateStr}T${schedule.breakStart}`);
          const breakEnd = parseISO(`${businessDateStr}T${schedule.breakEnd}`);
          
          isBreakTime = currentSlotTime >= breakStart && slotEndTime <= breakEnd;
          
          if (isBreakTime) {
            console.log(`Break time for ${practitioner.name} at ${formatInTimeZone(currentSlotTime, TIMEZONE, "HH:mm")}`);
          }
        }

        if (!hasConflict && !isBreakTime) {
          // Return times in UTC ISO format for the front-end
          availableSlots.push({
            startTime: currentSlotTimeUTC.toISOString(),
            endTime: slotEndTimeUTC.toISOString(),
            practitionerId: practitioner.id,
            practitionerName: practitioner.name,
          });
        }

        currentSlotTime = addMinutes(currentSlotTime, appointmentType.duration);
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