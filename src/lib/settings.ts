import { PrismaClient, DayOfWeek, Prisma, PractitionerRole } from '@prisma/client';

const prisma = new PrismaClient();

export interface CalendarSettings {
  businessHours: {
    [K in DayOfWeek]: {
      isOpen: boolean;
      startTime: string;
      endTime: string;
      breaks?: Array<{
        startTime: string;
        endTime: string;
        description?: string;
      }>;
    };
  };
  appointmentBuffers: {
    between: number;
    endOfDay: number;
  };
  scheduling: {
    maxDaysInAdvance: number;
    minHoursNotice: number;
  };
}

export type AppointmentTypeInput = {
  name: string;
  duration: number;
  description?: string;
  allowedRoles: PractitionerRole[];
};

export const settingsManager = {
  async saveOfficeSettings(settings: CalendarSettings) {
    const jsonSettings = {
      ...settings,
      businessHours: Object.fromEntries(
        Object.entries(settings.businessHours)
      )
    };

    await prisma.officeSettings.upsert({
      where: { name: 'calendar_settings' },
      update: { 
        value: jsonSettings
      },
      create: {
        name: 'calendar_settings',
        value: jsonSettings
      },
    });
  },

  async savePractitionerSchedule(practitionerId: string, schedules: Array<{
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>) {
    await prisma.schedule.deleteMany({
      where: {
        practitionerId,
        effectiveUntil: null,
      },
    });

    await prisma.schedule.createMany({
      data: schedules.map(schedule => ({
        practitionerId,
        ...schedule,
      })),
    });
  },

  async saveAppointmentType(appointmentType: AppointmentTypeInput) {
    return prisma.appointmentType.create({
      data: {
        name: appointmentType.name,
        duration: appointmentType.duration,
        description: appointmentType.description,
        allowedRoles: appointmentType.allowedRoles,
        isActive: true,
      },
    });
  },

  async getAvailableSlots(date: Date, appointmentTypeId: string) {
    const appointmentType = await prisma.appointmentType.findUnique({
      where: { id: appointmentTypeId }
    });

    if (!appointmentType) throw new Error('Appointment type not found');

    const dayOfWeek = date.getDay();
    const schedules = await prisma.schedule.findMany({
      where: {
        dayOfWeek: Object.values(DayOfWeek)[dayOfWeek - 1],
        isAvailable: true,
        practitioner: {
          isActive: true,
          role: {
            in: appointmentType.allowedRoles as PractitionerRole[]
          }
        },
      },
      include: {
        practitioner: true,
      },
    });
  

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    return calculateAvailableSlots(
      schedules,
      existingAppointments,
      appointmentType.duration
    );
  },
};

// Use the Prisma type directly for Schedule
type Schedule = Prisma.ScheduleGetPayload<{
    include: { practitioner: true };
  }>;
  
  // Use the Prisma type directly for Appointment
  type Appointment = Prisma.AppointmentGetPayload<{
    select: {
      startTime: true;
      endTime: true;
      practitionerId: true;
    };
  }>;
  
  function calculateAvailableSlots(
    schedules: Schedule[],
    existingAppointments: Appointment[],
    duration: number
  ): Array<{
    startTime: string;
    endTime: string;
    practitionerId: string;
    practitionerName: string;
  }> {
    const availableSlots: Array<{
      startTime: string;
      endTime: string;
      practitionerId: string;
      practitionerName: string;
    }> = [];
  
    for (const schedule of schedules) {
      const startTime = new Date(schedule.startTime);
      const endTime = new Date(schedule.endTime);
      
      // Iterate through the day in duration-sized chunks
      let currentTime = startTime;
      while (currentTime < endTime) {
        const slotEndTime = new Date(currentTime.getTime() + duration * 60000);
  
        // Check if this time slot conflicts with any existing appointments
        const hasConflict = existingAppointments.some(appt => {
          const apptStart = new Date(appt.startTime);
          const apptEnd = new Date(appt.endTime);
          return (
            (currentTime >= apptStart && currentTime < apptEnd) ||
            (slotEndTime > apptStart && slotEndTime <= apptEnd) ||
            (currentTime <= apptStart && slotEndTime >= apptEnd)
          );
        });
  
        // Check if this time slot is during a break
        const isBreakTime = schedule.breakStart && schedule.breakEnd && (
          currentTime >= new Date(schedule.breakStart) &&
          slotEndTime <= new Date(schedule.breakEnd)
        );
  
        if (!hasConflict && !isBreakTime) {
          availableSlots.push({
            startTime: currentTime.toISOString(),
            endTime: slotEndTime.toISOString(),
            practitionerId: schedule.practitionerId,
            practitionerName: schedule.practitioner.name
          });
        }
  
        currentTime = slotEndTime;
      }
    }
  
    return availableSlots;
  }