// src/app/api/admin/appointments/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseISO, format } from "date-fns";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        appointmentType: true,
        practitioner: true,
      },
      orderBy: [{ status: "asc" }, { startTime: "asc" }],
    });

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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Handle times consistently in Eastern Time
    let startTime, endTime;

    if (body.startTimeET && body.endTimeET) {
      // Use the provided Eastern Time strings directly
      startTime = parseISO(body.startTimeET);
      endTime = parseISO(body.endTimeET);
    } else {
      // Otherwise use the regular startTime/endTime fields
      startTime = parseISO(body.startTime);
      endTime = parseISO(body.endTime);
    }

    console.log("Creating appointment with received times:", {
      startTime: format(startTime, "yyyy-MM-dd'T'HH:mm:ss.SSS"),
      endTime: format(endTime, "yyyy-MM-dd'T'HH:mm:ss.SSS"),
      hours: startTime.getHours(),
      minutes: startTime.getMinutes(),
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

    // Format response with Eastern Time
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
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
