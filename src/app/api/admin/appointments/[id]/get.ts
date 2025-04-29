// src/app/api/admin/appointments/[id]/get.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        appointmentType: true,
        practitioner: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

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

    console.log("Fetched appointment with times (ET):", {
      id: appointment.id,
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
    console.error("Failed to fetch appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}
