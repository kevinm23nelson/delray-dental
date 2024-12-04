import { DayOfWeek } from '@prisma/client';

interface DaySchedule {
  startTime: string;
  endTime: string;
  isOpen?: boolean;
}

export function validateBusinessHours(data: { [key: string]: DaySchedule }) {
  try {
    const requiredDays = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY
    ];
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    for (const day of requiredDays) {
      const schedule = data[day];
      if (!schedule) return false;
      if (!timeRegex.test(schedule.startTime) || !timeRegex.test(schedule.endTime)) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}