import { NextResponse } from "next/server";
import { PrismaClient, AppointmentStatus, DayOfWeek } from "@prisma/client";
import { addMinutes, parseISO, format, set } from "date-fns";

const prisma = new PrismaClient();

interface ExistingAppointment {
  startTime: Date;
  endTime: Date;
}

interface BusinessHoursValue {
  [key: string]: {
    isOpen: boolean;
    startTime: string;
    endTime: string;
  }
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

    // Get business hours
    const businessHours = await prisma.officeSettings.findFirst({
      where: {
        name: "business_hours",
        effectiveUntil: null
      },
    });

    if (!businessHours) {
      return NextResponse.json(
        { error: "Business hours not configured" },
        { status: 400 }
      );
    }

    const businessHoursData = businessHours.value as BusinessHoursValue;
    const dayBusinessHours = businessHoursData[dayOfWeek];

    if (!dayBusinessHours?.isOpen) {
      return NextResponse.json([]);
    }

    // Get appointment type
    const appointmentType = await prisma.appointmentType.findUnique({
      where: { id: appointmentTypeId },
    });

    if (!appointmentType) {
      return NextResponse.json(
        { error: "Appointment type not found" },
        { status: 404 }
      );
    }

    // Get practitioners and their schedules
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
            effectiveUntil: null
          },
        },
      },
    });

    // Set up the day boundaries based on business hours
    const baseDate = new Date(date);
    const [officeStartHour, officeStartMinute] = dayBusinessHours.startTime.split(":").map(Number);
    const [officeEndHour, officeEndMinute] = dayBusinessHours.endTime.split(":").map(Number);

    const officeStart = set(baseDate, { 
      hours: officeStartHour, 
      minutes: officeStartMinute,
      seconds: 0,
      milliseconds: 0 
    });
    
    const officeEnd = set(baseDate, { 
      hours: officeEndHour, 
      minutes: officeEndMinute,
      seconds: 0,
      milliseconds: 0 
    });

    // Get existing appointments
    const practitionerAppointments = new Map<string, ExistingAppointment[]>();

    for (const practitioner of practitioners) {
      const appointments = await prisma.appointment.findMany({
        where: {
          practitionerId: practitioner.id,
          startTime: {
            gte: officeStart,
            lt: officeEnd,
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

    for (const practitioner of practitioners) {
      const schedule = practitioner.schedule[0];
      if (!schedule) continue;

      // Parse practitioner schedule times
      const [schedStartHour, schedStartMinute] = schedule.startTime.split(":").map(Number);
      const [schedEndHour, schedEndMinute] = schedule.endTime.split(":").map(Number);

      // Use the later start time between office hours and practitioner schedule
      const startTime = set(baseDate, {
        hours: Math.max(officeStartHour, schedStartHour),
        minutes: schedStartHour > officeStartHour ? schedStartMinute : officeStartMinute,
        seconds: 0,
        milliseconds: 0
      });

      // Use the earlier end time between office hours and practitioner schedule
      const endTime = set(baseDate, {
        hours: Math.min(officeEndHour, schedEndHour),
        minutes: schedEndHour < officeEndHour ? schedEndMinute : officeEndMinute,
        seconds: 0,
        milliseconds: 0
      });

      let currentTime = startTime;
      const practitionerExistingAppointments = practitionerAppointments.get(practitioner.id) || [];

      while (currentTime < endTime) {
        const slotEndTime = addMinutes(currentTime, appointmentType.duration);
        if (slotEndTime > endTime) break;

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
          currentTime >= parseISO(`${format(date, "yyyy-MM-dd")}T${schedule.breakStart}`) &&
          slotEndTime <= parseISO(`${format(date, "yyyy-MM-dd")}T${schedule.breakEnd}`);

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

    // Sort slots by time and then practitioner name
    availableSlots.sort((a, b) => {
      const timeComparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
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