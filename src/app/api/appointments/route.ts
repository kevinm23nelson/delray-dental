// src/app/api/appointments/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseISO, subHours } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const prisma = new PrismaClient();
const TIMEZONE = 'America/New_York'; // Eastern Time

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Parse the input times and adjust them back by 5 hours
    // This is because the frontend artificially added 5 hours to make them display correctly
    const startTimeDisplay = parseISO(body.startTime);
    const endTimeDisplay = parseISO(body.endTime);
    
    // Subtract 5 hours to get the actual Eastern Time that was intended
    const startTimeActual = subHours(startTimeDisplay, 5);
    const endTimeActual = subHours(endTimeDisplay, 5);
    
    console.log("Booking appointment:", {
      displayStartTime: startTimeDisplay.toISOString(),
      displayEndTime: endTimeDisplay.toISOString(),
      actualStartTime: startTimeActual.toISOString(),
      actualEndTime: endTimeActual.toISOString()
    });

    // Create the appointment with the actual times
    const appointment = await prisma.appointment.create({
      data: {
        patientName: body.name,
        patientEmail: body.email,
        patientPhone: body.phone,
        notes: body.notes,
        startTime: startTimeActual,
        endTime: endTimeActual,
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