// src/app/api/admin/appointments/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";

const prisma = new PrismaClient();
const TIMEZONE = "America/New_York"; // Eastern Time

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

// Helper function to ensure correct timezone handling in production
function createUTCFromET(etDateString: string): Date {
  const etDate = parseISO(etDateString);

  // For production, we manually apply a fixed 8-hour offset
  if (isProduction()) {
    console.log("⚠️ Using FIXED 8-hour timezone conversion for production");
    // Get the date components in Eastern Time
    const year = etDate.getFullYear();
    const month = etDate.getMonth();
    const day = etDate.getDate();
    const hours = etDate.getHours();
    const minutes = etDate.getMinutes();
    const seconds = etDate.getSeconds();
    const ms = etDate.getMilliseconds();

    // Create a new UTC date with the Eastern Time values
    // For an 8-hour offset: If it's 10:00 ET, we create 10:00 UTC
    const result = new Date(
      Date.UTC(year, month, day, hours, minutes, seconds, ms)
    );

    console.log("ET to UTC conversion (production admin):", {
      original: etDateString,
      result: result.toISOString(),
    });

    return result;
  } else {
    console.log("Using standard timezone conversion for development");
    // For development, use the dynamic timezone offset
    // Get ET timezone information with proper DST handling
    const etTime = formatInTimeZone(
      etDate,
      TIMEZONE,
      "yyyy-MM-dd'T'HH:mm:ss.SSS"
    );
    const etOffset = formatInTimeZone(etDate, TIMEZONE, "xxx"); // Gets +/-xx:xx format

    // Create ISO string with explicit timezone
    const etISOString = `${etTime}${etOffset}`;

    // Parse as UTC date
    return new Date(etISOString);
  }
}

export async function GET() {
  try {
    console.log("Admin API - Server time:", new Date().toString());
    console.log(
      "Admin API - Server timezone offset:",
      new Date().getTimezoneOffset()
    );
    console.log("Admin API - Environment:", process.env.NODE_ENV || "not set");

    const appointments = await prisma.appointment.findMany({
      include: {
        appointmentType: true,
        practitioner: true,
      },
      orderBy: [{ status: "asc" }, { startTime: "asc" }],
    });

    const formattedAppointments = appointments.map((appointment) => {
      // Convert UTC dates from database to Eastern Time
      const startTimeET = toZonedTime(appointment.startTime, TIMEZONE);
      const endTimeET = toZonedTime(appointment.endTime, TIMEZONE);

      return {
        ...appointment,
        startTime: formatInTimeZone(
          startTimeET,
          TIMEZONE,
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        ),
        endTime: formatInTimeZone(
          endTimeET,
          TIMEZONE,
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        ),
      };
    });

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error("Failed to get appointments:", error);
    return NextResponse.json(
      { error: "Failed to get appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Admin API POST - Request body:", body);
    console.log("Admin API POST - Server time:", new Date().toString());

    // Check if startTime and endTime are provided in Eastern Time
    let startTime, endTime;

    if (body.startTimeET && body.endTimeET) {
      // If Eastern Time values are provided, convert to UTC for storage
      startTime = createUTCFromET(body.startTimeET);
      endTime = createUTCFromET(body.endTimeET);

      console.log("Converting admin-provided ET times to UTC:", {
        startTimeET: body.startTimeET,
        endTimeET: body.endTimeET,
        startTimeUTC: startTime.toISOString(),
        endTimeUTC: endTime.toISOString(),
      });
    } else {
      // Otherwise, parse the input times as UTC
      startTime = parseISO(body.startTime);
      endTime = parseISO(body.endTime);

      console.log("Using provided UTC times:", {
        startTimeUTC: startTime.toISOString(),
        endTimeUTC: endTime.toISOString(),
      });
    }

    console.log("Creating appointment with times (UTC):", {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });

    // Create appointment with the parsed times
    const appointment = await prisma.appointment.create({
      data: {
        ...body,
        startTime,
        endTime,
      },
      include: {
        appointmentType: true,
        practitioner: true,
      },
    });

    // Convert times to Eastern Time for response
    const startTimeET = toZonedTime(appointment.startTime, TIMEZONE);
    const endTimeET = toZonedTime(appointment.endTime, TIMEZONE);

    console.log("Appointment created with times (ET):", {
      startTime: formatInTimeZone(
        startTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
      endTime: formatInTimeZone(
        endTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
    });

    return NextResponse.json({
      ...appointment,
      startTime: formatInTimeZone(
        startTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
      endTime: formatInTimeZone(
        endTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
    });
  } catch (error) {
    console.error("Failed to create appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
