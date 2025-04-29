// src/app/api/appointments/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseISO, format } from "date-fns";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Parse the times from the request - these now have explicit ET timezone info
    // Format: 2023-05-15T14:30:00.000-04:00
    const startTime = parseISO(body.startTime);
    const endTime = parseISO(body.endTime);

    // Log the received timestamps for debugging
    console.log("Booking appointment with Eastern Time:", {
      receivedStartTime: body.startTime,
      receivedEndTime: body.endTime,
      parsedStartTime: format(startTime, "yyyy-MM-dd'T'HH:mm:ss.SSS"),
      parsedEndTime: format(endTime, "yyyy-MM-dd'T'HH:mm:ss.SSS"),
      hours: startTime.getHours(),
      minutes: startTime.getMinutes(),
    });

    // Create the appointment with the provided Eastern Time
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

    // Format the response with Eastern Time
    const formattedStartTime = format(
      appointment.startTime,
      "yyyy-MM-dd'T'HH:mm:ss.SSS'-04:00'"
    );
    const formattedEndTime = format(
      appointment.endTime,
      "yyyy-MM-dd'T'HH:mm:ss.SSS'-04:00'"
    );

    // Also create display-friendly formats
    const displayStartTime = format(appointment.startTime, "h:mm a");
    const displayEndTime = format(appointment.endTime, "h:mm a");
    const displayDate = format(appointment.startTime, "EEEE, MMMM d, yyyy");

    console.log("Appointment created with times (ET):", {
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      displayTime: `${displayStartTime} - ${displayEndTime}`,
      displayDate,
    });

    return NextResponse.json({
      ...appointment,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      displayTime: `${displayStartTime} - ${displayEndTime}`,
      displayDate,
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

    // Format appointments for response with Eastern Time
    const formattedAppointments = appointments.map((appointment) => {
      const formattedStartTime = format(
        appointment.startTime,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'-04:00'"
      );

      const formattedEndTime = format(
        appointment.endTime,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'-04:00'"
      );

      const displayStartTime = format(appointment.startTime, "h:mm a");
      const displayEndTime = format(appointment.endTime, "h:mm a");
      const displayDate = format(appointment.startTime, "EEEE, MMMM d, yyyy");

      return {
        ...appointment,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        displayTime: `${displayStartTime} - ${displayEndTime}`,
        displayDate,
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
