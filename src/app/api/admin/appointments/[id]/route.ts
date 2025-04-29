// src/app/api/admin/appointments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const prisma = new PrismaClient();
const TIMEZONE = "America/New_York"; // Eastern Time

// Detect if we're on the production domain
function isProduction() {
  // This is more reliable than checking NODE_ENV
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production" ||
    (typeof window !== "undefined" &&
      window.location &&
      window.location.hostname === "delraydental.com")
  );
}

// Helper function for production timezone handling
function handleTimezoneCorrection(date: Date): Date {
  // Check if we're in production
  if (isProduction()) {
    console.log("⚠️ Applying FIXED 8-hour timezone correction");
    // In production, we keep the same hour value for display purposes
    const result = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );

    console.log("Timezone correction:", {
      original: date.toISOString(),
      corrected: result.toISOString(),
    });

    return result;
  }

  return date;
}

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
    console.log("PATCH [id] - Environment:", process.env.NODE_ENV || "not set");

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

    // Apply timezone correction for production if needed
    const correctedStartTime = handleTimezoneCorrection(appointment.startTime);
    const correctedEndTime = handleTimezoneCorrection(appointment.endTime);

    // Convert times to Eastern Time
    const startTimeET = toZonedTime(correctedStartTime, TIMEZONE);
    const endTimeET = toZonedTime(correctedEndTime, TIMEZONE);

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
    console.log("GET [id] - Environment:", process.env.NODE_ENV || "not set");

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

    // Apply timezone correction for production if needed
    const correctedStartTime = handleTimezoneCorrection(appointment.startTime);
    const correctedEndTime = handleTimezoneCorrection(appointment.endTime);

    // Log the original UTC times from the database
    console.log("GET [id] - Original UTC appointment times:", {
      id: appointment.id,
      startTimeUTC: appointment.startTime.toISOString(),
      correctedStartTimeUTC: correctedStartTime.toISOString(),
    });

    // Convert times to Eastern Time
    const startTimeET = toZonedTime(correctedStartTime, TIMEZONE);
    const endTimeET = toZonedTime(correctedEndTime, TIMEZONE);

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
