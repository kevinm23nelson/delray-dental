// src/app/api/admin/appointments/[id]/patch.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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
