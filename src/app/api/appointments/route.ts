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

    // Parse the input times - these now come in already adjusted
    // No need to subtract hours, as they're already in the correct display format for ET
    const startTime = parseISO(body.startTime);
    const endTime = parseISO(body.endTime);
    
    console.log("Booking appointment:", {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });

    // Create the appointment with the parsed times
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