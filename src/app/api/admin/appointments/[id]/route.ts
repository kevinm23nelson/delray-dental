// src/app/api/admin/appointments/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id;
    const body = await request.json();

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        patientName: body.patientName,
        patientEmail: body.patientEmail,
        patientPhone: body.patientPhone,
        notes: body.notes,
        status: body.status,
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

    return NextResponse.json({
      ...appointment,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      displayTime: `${displayStartTime} - ${displayEndTime}`,
      displayDate,
    });
  } catch (error) {
    console.error("Failed to update appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id;

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
