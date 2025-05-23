// src/app/api/admin/appointments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";

const prisma = new PrismaClient();

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract ID from the URL path using pathname segments
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

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

    // Preserve the original timestamps by passing them directly
    // Since the stored time in the database is already in Eastern Time
    const displayStartTime = format(appointment.startTime, "h:mm a");
    const displayEndTime = format(appointment.endTime, "h:mm a");
    const displayDate = format(appointment.startTime, "EEEE, MMMM d, yyyy");

    console.log("Fetched appointment with times:", {
      id: appointment.id,
      startTimeRaw: appointment.startTime.toISOString(),
      endTimeRaw: appointment.endTime.toISOString(),
      displayTime: `${displayStartTime} - ${displayEndTime}`,
      displayDate,
    });

    return NextResponse.json({
      ...appointment,
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString(),
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

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract ID from the URL path using pathname segments
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const appointment = await prisma.appointment.update({
      where: { id },
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

    // Preserve the original timestamps by passing them directly
    const displayStartTime = format(appointment.startTime, "h:mm a");
    const displayEndTime = format(appointment.endTime, "h:mm a");
    const displayDate = format(appointment.startTime, "EEEE, MMMM d, yyyy");

    return NextResponse.json({
      ...appointment,
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString(),
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

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract ID from the URL path using pathname segments
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    await prisma.appointment.delete({
      where: { id },
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
