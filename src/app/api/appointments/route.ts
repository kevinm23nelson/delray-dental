// src/app/api/appointments/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseISO } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const prisma = new PrismaClient();
const TIMEZONE = 'America/New_York'; // Eastern Time

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Parse the input times
    const startTimeISO = parseISO(body.startTime);
    const endTimeISO = parseISO(body.endTime);

    // Create the appointment with the parsed times
    // Note: We don't need to convert to Eastern Time here as the times
    // will be stored in UTC in the database
    const appointment = await prisma.appointment.create({
      data: {
        patientName: body.name,
        patientEmail: body.email,
        patientPhone: body.phone,
        notes: body.notes,
        startTime: startTimeISO,
        endTime: endTimeISO,
        practitionerId: body.practitionerId,
        typeId: body.appointmentTypeId,
        status: "SCHEDULED",
      },
      include: {
        appointmentType: true,
        practitioner: true,
      },
    });

    // Convert the UTC times to Eastern Time for the response
    const startTimeET = toZonedTime(appointment.startTime, TIMEZONE);
    const endTimeET = toZonedTime(appointment.endTime, TIMEZONE);

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
        details: error instanceof Error ? error.message : "Unknown error"
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
    const formattedAppointments = appointments.map(appointment => {
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