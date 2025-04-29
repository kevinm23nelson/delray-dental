// src/app/api/appointments/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const prisma = new PrismaClient();
const TIMEZONE = "America/New_York"; // Eastern Time

// Define a type for the request body
interface AppointmentRequestBody {
  isFromProductionSite?: boolean;
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  practitionerId: string;
  appointmentTypeId: string;
  [key: string]: unknown;
}

// Detect if we're on the production domain or if the request came from production
function isProduction(requestBody?: AppointmentRequestBody): boolean {
  // Check for the flag from the frontend
  if (requestBody && requestBody.isFromProductionSite === true) {
    console.log("Request identified as coming from production site via flag");
    return true;
  }

  // Otherwise check environment variables
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production" ||
    (typeof window !== "undefined" &&
      window.location &&
      window.location.hostname === "delraydental.com")
  );
}

// Helper function to ensure correct timezone handling in production
function parseUTCDate(
  isoString: string,
  requestBody?: AppointmentRequestBody
): Date {
  console.log("Original ISO string:", isoString);

  // Always use production approach on the live site to handle the 8-hour difference
  if (isProduction(requestBody)) {
    console.log("⚠️ Using FIXED 8-hour timezone handling for production");

    try {
      // Parse the date
      const date = new Date(isoString);

      // Explicitly read UTC components
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDate();
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const seconds = date.getUTCSeconds();

      // Create a date with these same components, forcing UTC to match desired local time
      const result = new Date(
        Date.UTC(year, month, day, hours, minutes, seconds)
      );

      console.log("✅ Production time conversion:", {
        original: isoString,
        parsed: date.toISOString(),
        result: result.toISOString(),
      });

      return result;
    } catch (error) {
      console.error("Error parsing date:", error);
      // Fallback to standard parsing
      return new Date(isoString);
    }
  } else {
    // In development, just parse normally
    console.log("Using standard time parsing for development");
    return new Date(isoString);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Appointment request body:", body);
    console.log("Server environment:", {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV || "not set",
      isProductionByFunction: isProduction(body),
      isFromProductionSite: body.isFromProductionSite || false,
    });
    console.log("Server time:", new Date().toString());
    console.log("Server timezone offset:", new Date().getTimezoneOffset());

    // Parse the UTC times from the available-slots API
    // These should already be in UTC format from the available-slots API
    const startTime = parseUTCDate(body.startTime, body);
    const endTime = parseUTCDate(body.endTime, body);

    console.log("Booking appointment in UTC (for database storage):", {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      originalStartTime: body.startTime,
      originalEndTime: body.endTime,
    });

    // Create the appointment with the UTC times
    const appointment = await prisma.appointment.create({
      data: {
        patientName: body.name,
        patientEmail: body.email,
        patientPhone: body.phone,
        notes: body.notes,
        startTime: startTime,
        endTime: endTime,
        practitionerId: body.practitionerId,
        typeId: body.appointmentTypeId,
        status: "PENDING",
      },
      include: {
        appointmentType: true,
        practitioner: true,
      },
    });

    // Convert the UTC times to Eastern Time for the response
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
      {
        error: "Failed to create appointment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        appointmentType: true,
        practitioner: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // Convert the UTC times to Eastern Time for the response
    const formattedAppointments = appointments.map((appointment) => {
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
