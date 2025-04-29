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

// Detect if we're on the production domain
function isProduction() {
  // This is more reliable than checking NODE_ENV
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production" ||
    (typeof window !== "undefined" &&
      window.location &&
      window.location.hostname === "delraydental.com")
  );
}

// Helper function to convert a date in Eastern Time to UTC for production
function convertETtoUTC(dateET: Date): Date {
  // For production, we manually apply a fixed 8-hour offset
  // This ensures consistent behavior across all environments
  if (isProduction()) {
    console.log("⚠️ Using FIXED 8-hour timezone conversion for production");
    // Get the date components in Eastern Time
    const year = dateET.getFullYear();
    const month = dateET.getMonth();
    const day = dateET.getDate();
    const hours = dateET.getHours();
    const minutes = dateET.getMinutes();
    const seconds = dateET.getSeconds();
    const ms = dateET.getMilliseconds();

    // Create a new UTC date with the Eastern Time values
    // For an 8-hour offset: If it's 10:00 ET, we create 10:00 UTC
    // This effectively shifts the time by the exact needed amount
    const result = new Date(
      Date.UTC(year, month, day, hours, minutes, seconds, ms)
    );

    console.log("ET to UTC conversion (production):", {
      original: dateET.toString(),
      result: result.toISOString(),
    });

    return result;
  } else {
    console.log("Using standard timezone conversion for development");
    // For development, we use the dynamic timezone offset
    // Get ET timezone information with proper DST handling
    const etTime = formatInTimeZone(
      dateET,
      TIMEZONE,
      "yyyy-MM-dd'T'HH:mm:ss.SSS"
    );
    const etOffset = formatInTimeZone(dateET, TIMEZONE, "xxx"); // Gets +/-xx:xx format

    // Create ISO string with explicit timezone
    const etISOString = `${etTime}${etOffset}`;

    // Parse as UTC date
    return new Date(etISOString);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    const appointmentTypeId = searchParams.get("appointmentTypeId");

    console.log("Query params:", { dateStr, appointmentTypeId });
    console.log("Server time:", new Date().toString());
    console.log("Server timezone offset:", new Date().getTimezoneOffset());
    console.log("Environment:", process.env.NODE_ENV || "not set");

    if (!dateStr || !appointmentTypeId) {
      console.log("Missing required parameters");
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Parse the requested date
    const utcDate = parseISO(dateStr);
    console.log("Parsed UTC date:", utcDate.toISOString());

    // Convert to Eastern Time for business logic
    const dateET = toZonedTime(utcDate, TIMEZONE);
    console.log(
      "Date in ET:",
      format(dateET, "yyyy-MM-dd"),
      "Original UTC date:",
      utcDate.toISOString()
    );

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

    // Convert Eastern Time day boundaries to UTC for database query
    const startOfDayUTC = convertETtoUTC(startOfDayET);
    const endOfDayUTC = convertETtoUTC(endOfDayET);

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
          // For display time, we use the Eastern Time hours directly
          const slotTime = format(currentTimeET, "h:mm a");
          const slotEndTime = format(slotEndTimeET, "h:mm a");

          // Convert Eastern Time to UTC correctly for database storage
          const utcStartTime = convertETtoUTC(currentTimeET);
          const utcEndTime = convertETtoUTC(slotEndTimeET);

          console.log("Creating slot:", {
            displayTime: slotTime,
            displayEndTime: slotEndTime,
            currentTimeET: format(currentTimeET, "yyyy-MM-dd'T'HH:mm:ss.SSS"),
            slotEndTimeET: format(slotEndTimeET, "yyyy-MM-dd'T'HH:mm:ss.SSS"),
            utcStartTime: utcStartTime.toISOString(),
            utcEndTime: utcEndTime.toISOString(),
          });

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
