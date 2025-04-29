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
    console.log("PATCH [id] - Request body:", data);
    console.log("PATCH [id] - Server time:", new Date().toString());
    console.log(
      "PATCH [id] - Server timezone offset:",
      new Date().getTimezoneOffset()
    );

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

    console.log("PATCH [id] - Original UTC appointment times:", {
      startTimeUTC: appointment.startTime.toISOString(),
      endTimeUTC: appointment.endTime.toISOString(),
    });

    console.log("PATCH [id] - Converted to Eastern Time:", {
      startTimeET: formatInTimeZone(
        startTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
      endTimeET: formatInTimeZone(
        endTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
    });

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

    console.log("GET [id] - Request for appointment ID:", id);
    console.log("GET [id] - Server time:", new Date().toString());
    console.log(
      "GET [id] - Server timezone offset:",
      new Date().getTimezoneOffset()
    );

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

    // Log the original UTC times from the database
    console.log("GET [id] - Original UTC appointment times:", {
      id: appointment.id,
      startTimeUTC: appointment.startTime.toISOString(),
      endTimeUTC: appointment.endTime.toISOString(),
    });

    // Convert times to Eastern Time
    const startTimeET = toZonedTime(appointment.startTime, TIMEZONE);
    const endTimeET = toZonedTime(appointment.endTime, TIMEZONE);

    // Log the converted Eastern Times
    console.log("GET [id] - Converted to Eastern Time:", {
      startTimeET: formatInTimeZone(
        startTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
      startTimeFormatted: formatInTimeZone(startTimeET, TIMEZONE, "h:mm a"),
      endTimeET: formatInTimeZone(
        endTimeET,
        TIMEZONE,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
      endTimeFormatted: formatInTimeZone(endTimeET, TIMEZONE, "h:mm a"),
    });

    const formattedResponse = {
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

    // Log the final response
    console.log("GET [id] - Response payload:", {
      startTime: formattedResponse.startTime,
      endTime: formattedResponse.endTime,
    });

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Failed to fetch appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}
