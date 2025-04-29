// src/app/api/admin/appointments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const prisma = new PrismaClient();
const TIMEZONE = "America/New_York"; // Eastern Time

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const id = req.url.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Missing appointment ID" },
        { status: 400 }
      );
    }

    const data = await req.json();

    if (data.patientPhone === "") {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const appointmentData = {
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      patientPhone: data.patientPhone,
      notes: data.notes,
      status: data.status,
    };

    const appointment = await prisma.appointment.update({
      where: { id },
      data: appointmentData,
      include: {
        appointmentType: true,
        practitioner: true,
      },
    });

    // Convert times to Eastern Time
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
    console.error("Failed to update appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const id = req.url.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Missing appointment ID" },
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

    // Convert times to Eastern Time
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
    console.error("Failed to fetch appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}
