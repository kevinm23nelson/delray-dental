// src/app/api/appointments/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const prisma = new PrismaClient();
const TIMEZONE = "America/New_York"; // Eastern Time

// Helper function to ensure correct timezone handling in production
function parseUTCDate(isoString: string): Date {
  return new Date(isoString);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Appointment request body:", body);
    console.log("Server environment:", process.env.NODE_ENV);
    console.log("Server time:", new Date().toString());
    console.log("Server timezone offset:", new Date().getTimezoneOffset());

    // Parse the UTC times from the available-slots API
    // These should already be in UTC format from the available-slots API
    const startTime = parseUTCDate(body.startTime);
    const endTime = parseUTCDate(body.endTime);

    console.log("Booking appointment in UTC (for database storage):", {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
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
