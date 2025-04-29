// src/app/admin/appointments/components/AppointmentModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentStatus } from "@prisma/client";
import type { Appointment } from "@/types/calendar";
import { formatInTimeZone } from "date-fns-tz";

interface AppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSave: (updatedAppointment: {
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    notes?: string;
    status: AppointmentStatus;
  }) => Promise<void>;
}

// Define the Eastern timezone constant
const TIMEZONE = "America/New_York";

export default function AppointmentModal({
  appointment,
  onClose,
  onSave,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    patientName: appointment.patientName,
    patientEmail: appointment.patientEmail,
    patientPhone: appointment.patientPhone,
    notes: appointment.notes || "",
    status: appointment.status,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Log the received appointment times for debugging
  console.log("AppointmentModal received appointment times:", {
    rawStartTime: appointment.startTime,
    rawEndTime: appointment.endTime,
  });

  const startTime = new Date(appointment.startTime);
  const endTime = new Date(appointment.endTime);

  console.log("Parsed appointment times:", {
    startTimeISO: startTime.toISOString(),
    endTimeISO: endTime.toISOString(),
  });

  const formattedDate = formatInTimeZone(
    startTime,
    TIMEZONE,
    "EEEE, MMMM d, yyyy"
  );

  const formattedStartTime = formatInTimeZone(startTime, TIMEZONE, "h:mm a");

  const formattedEndTime = formatInTimeZone(endTime, TIMEZONE, "h:mm a");

  console.log("Formatted appointment times (ET):", {
    formattedDate,
    formattedStartTime,
    formattedEndTime,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative min-h-screen sm:min-h-[auto] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Appointment Details</h2>
              <p className="text-gray-600">
                {formattedDate}
                {" at "}
                {formattedStartTime}
                {" - "}
                {formattedEndTime}
                {" ET"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Patient Name</Label>
              <Input
                value={formData.patientName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    patientName: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <Label>Patient Email</Label>
              <Input
                type="email"
                value={formData.patientEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    patientEmail: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Input
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={formData.patientPhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    patientPhone: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: AppointmentStatus) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
