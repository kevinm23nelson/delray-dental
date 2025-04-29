// src/app/api/appointments/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseISO } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const prisma = new PrismaClient();
const TIMEZONE = "America/New_York"; // Eastern Time

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Parse the times from the request
    // These should be UTC ISO strings from the available-slots API's convertETtoUTC function
    const startTime = parseISO(body.startTime);
    const endTime = parseISO(body.endTime);

    // Log the received timestamps for debugging
    console.log("Booking appointment with supplied times:", {
      receivedStartTime: body.startTime,
      receivedEndTime: body.endTime,
      parsedStartTime: startTime.toISOString(),
      parsedEndTime: endTime.toISOString(),
    });

    // Verify these are properly formatted Eastern Time for display
    const startTimeET = toZonedTime(startTime, TIMEZONE);
    const endTimeET = toZonedTime(endTime, TIMEZONE);
    console.log("Appointment times in Eastern Time:", {
      startTimeET: formatInTimeZone(
        startTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
      ),
      endTimeET: formatInTimeZone(
        endTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
      ),
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
    const responseStartTimeET = toZonedTime(appointment.startTime, TIMEZONE);
    const responseEndTimeET = toZonedTime(appointment.endTime, TIMEZONE);

    console.log("Appointment created with times (ET):", {
      startTime: formatInTimeZone(
        responseStartTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
      ),
      endTime: formatInTimeZone(
        responseEndTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
      ),
    });

    return NextResponse.json({
      ...appointment,
      startTime: formatInTimeZone(
        responseStartTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
      ),
      endTime: formatInTimeZone(
        responseEndTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
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
