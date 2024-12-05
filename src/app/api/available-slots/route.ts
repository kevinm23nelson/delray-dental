import { NextResponse } from "next/server";
import { PrismaClient, AppointmentStatus, DayOfWeek } from "@prisma/client";
import { addMinutes, parseISO, format, isBefore, isAfter } from "date-fns";

const prisma = new PrismaClient();

interface ExistingAppointment {
  startTime: Date;
  endTime: Date;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    const appointmentTypeId = searchParams.get("appointmentTypeId");

    if (!dateStr || !appointmentTypeId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const date = parseISO(dateStr);
    const dayOfWeek = format(date, "EEEE").toUpperCase() as DayOfWeek;

    // Get business hours for the selected day
    const businessHours = await prisma.officeSettings.findFirst({
      where: {
        name: "businessHours",
        effectiveUntil: null,
      },
    });

    if (!businessHours) {
      return NextResponse.json(
        { error: "Business hours not configured" },
        { status: 400 }
      );
    }

    const businessHoursData = businessHours.value as Record<string, {
      startTime: string;
      endTime: string;
      isOpen: boolean;
    }>;

    const dayBusinessHours = businessHoursData[dayOfWeek];
    if (!dayBusinessHours?.isOpen) {
      return NextResponse.json([]);
    }

    const appointmentType = await prisma.appointmentType.findUnique({
      where: { id: appointmentTypeId },
    });

    if (!appointmentType) {
      return NextResponse.json(
        { error: "Appointment type not found" },
        { status: 404 }
      );
    }

    const practitioners = await prisma.practitioner.findMany({
      where: {
        isActive: true,
        role: { in: appointmentType.allowedRoles },
      },
      include: {
        schedule: {
          where: {
            dayOfWeek,
            isAvailable: true,
          },
        },
      },
    });

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const practitionerAppointments = new Map<string, ExistingAppointment[]>();

    for (const practitioner of practitioners) {
      const appointments = await prisma.appointment.findMany({
        where: {
          practitionerId: practitioner.id,
          startTime: {
            gte: startOfDay,
            lt: endOfDay,
          },
          status: {
            in: [AppointmentStatus.PENDING, AppointmentStatus.SCHEDULED],
          },
        },
        select: {
          startTime: true,
          endTime: true,
        },
      });
      practitionerAppointments.set(practitioner.id, appointments);
    }

    const availableSlots = [];

    // Parse business hours
    const officeStart = parseISO(`${format(date, "yyyy-MM-dd")}T${dayBusinessHours.startTime}`);
    const officeEnd = parseISO(`${format(date, "yyyy-MM-dd")}T${dayBusinessHours.endTime}`);

    for (const practitioner of practitioners) {
      const schedule = practitioner.schedule[0];
      if (!schedule) continue;

      // Use the later start time between office hours and practitioner schedule
      const startTime = parseISO(`${format(date, "yyyy-MM-dd")}T${schedule.startTime}`);
      const effectiveStartTime = isAfter(startTime, officeStart) ? startTime : officeStart;

      // Use the earlier end time between office hours and practitioner schedule
      const endTime = parseISO(`${format(date, "yyyy-MM-dd")}T${schedule.endTime}`);
      const effectiveEndTime = isBefore(endTime, officeEnd) ? endTime : officeEnd;

      let currentTime = effectiveStartTime;

      const practitionerExistingAppointments =
        practitionerAppointments.get(practitioner.id) || [];

      while (currentTime < effectiveEndTime) {
        const slotEndTime = addMinutes(currentTime, appointmentType.duration);
        if (slotEndTime > effectiveEndTime) break;

        const hasConflict = practitionerExistingAppointments.some(
          (appt: ExistingAppointment) => {
            const apptStart = new Date(appt.startTime);
            const apptEnd = new Date(appt.endTime);
            return (
              (currentTime >= apptStart && currentTime < apptEnd) ||
              (slotEndTime > apptStart && slotEndTime <= apptEnd) ||
              (currentTime <= apptStart && slotEndTime >= apptEnd)
            );
          }
        );

        const isBreakTime =
          schedule.breakStart &&
          schedule.breakEnd &&
          currentTime >=
            parseISO(`${format(date, "yyyy-MM-dd")}T${schedule.breakStart}`) &&
          slotEndTime <=
            parseISO(`${format(date, "yyyy-MM-dd")}T${schedule.breakEnd}`);

        if (!hasConflict && !isBreakTime) {
          availableSlots.push({
            startTime: currentTime.toISOString(),
            endTime: slotEndTime.toISOString(),
            practitionerId: practitioner.id,
            practitionerName: practitioner.name,
          });
        }

        currentTime = addMinutes(currentTime, appointmentType.duration);
      }
    }

    availableSlots.sort((a, b) => {
      const timeComparison =
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      if (timeComparison === 0) {
        return a.practitionerName.localeCompare(b.practitionerName);
      }
      return timeComparison;
    });

    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error("Failed to get available slots:", error);
    return NextResponse.json(
      {
        error: "Failed to get available slots",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}