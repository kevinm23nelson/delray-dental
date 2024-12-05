// src/types/calendar.ts
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY";
export type PractitionerRole = "DENTIST" | "HYGIENIST" | "OFFICE_STAFF";
export type ClinicalRole = "DENTIST" | "HYGIENIST";
export type AppointmentStatus =
  | "PENDING"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED";

export interface BusinessHours {
  [key: string]: {
    startTime: string;
    endTime: string;
    isOpen: boolean;
  };
}

export interface PractitionerSchedule {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  breakStart?: string;
  breakEnd?: string;
  effectiveFrom: Date;
  effectiveUntil?: Date;
}

export interface Practitioner {
  id: string;
  name: string;
  role: PractitionerRole;
  phone: string;
  email?: string;
  address?: string;
  startDate: Date;
  isActive: boolean;
  schedule: PractitionerSchedule[];
  appointments?: Appointment[];
  notes?: PractitionerNote[];
}

export interface PractitionerNote {
  id: string;
  content: string;
  practitionerId: string;
  createdAt: Date;
  createdBy: string;
}

export interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  description?: string;
  allowedRoles: PractitionerRole[];
  isActive: boolean;
}

export interface Appointment {
  id: string;
  appointmentType: AppointmentType;
  typeId: string;
  startTime: Date;
  endTime: Date;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  notes?: string;
  practitioner: Practitioner;
  practitionerId: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  practitionerId: string;
  practitionerName: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}
