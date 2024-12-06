import type {
  BusinessHours,
  Practitioner,
  AppointmentType,
} from "@/types/calendar";

export const calendarApi = {
  async getBusinessHours() {
    const response = await fetch("/api/settings/business-hours");
    if (!response.ok) throw new Error("Failed to fetch business hours");
    return response.json();
  },

  async updateBusinessHours(data: BusinessHours) {
    const response = await fetch("/api/settings/business-hours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update business hours");
    return response.json();
  },

  async getPractitioners() {
    const response = await fetch("/api/settings/practitioners");
    if (!response.ok) throw new Error("Failed to fetch practitioners");
    return response.json();
  },

  async createPractitioner(data: Omit<Practitioner, "id">) {
    const response = await fetch("/api/settings/practitioners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create practitioner");
    return response.json();
  },

  async getAppointmentTypes() {
    const response = await fetch("/api/settings/appointment-types");
    if (!response.ok) throw new Error("Failed to fetch appointment types");
    return response.json();
  },

  async createAppointmentType(data: Omit<AppointmentType, "id" | "isActive">) {
    const response = await fetch("/api/settings/appointment-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create appointment type");
    return response.json();
  },
};
