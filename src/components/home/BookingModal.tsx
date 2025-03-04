// src/app/components/BookingModal.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { emailService } from "@/lib/emailService";

interface TimeSlot {
  startTime: string;
  endTime: string;
  practitionerId: string;
  practitionerName: string;
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  appointmentType: {
    id: string;
    name: string;
    duration: number;
    description?: string;
  };
  onBookAppointment?: (
    data: BookingFormData & {
      startTime: string;
      endTime: string;
      practitionerId: string;
      appointmentTypeId: string;
    }
  ) => Promise<void>;
}

export default function BookingModal({
  isOpen,
  onClose,
  selectedDate,
  appointmentType,
  onBookAppointment,
}: BookingModalProps) {
  const [step, setStep] = useState<"time-selection" | "details">(
    "time-selection"
  );
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Get client timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    async function fetchAvailableSlots() {
      setIsLoading(true);
      try {
        const dateParam = selectedDate.toISOString();
        const url = `/api/available-slots?date=${encodeURIComponent(
          dateParam
        )}&appointmentTypeId=${encodeURIComponent(appointmentType.id)}`;

        console.log("Fetching slots with URL:", url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("Response status:", response.status);
        console.log("Response data:", data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch available slots");
        }

        setAvailableSlots(data);
      } catch (error) {
        console.error("Error details:", error);
        toast.error("Failed to load available time slots");
        setAvailableSlots([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (isOpen && selectedDate) {
      fetchAvailableSlots();
    }
  }, [isOpen, selectedDate, appointmentType.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setIsSubmitting(true);
    try {
      console.log("Starting appointment booking process...");

      // Create the appointment
      const appointmentData = {
        ...formData,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        practitionerId: selectedSlot.practitionerId,
        appointmentTypeId: appointmentType.id,
      };

      console.log("Sending appointment data:", appointmentData);

      if (onBookAppointment) {
        await onBookAppointment(appointmentData);
      } else {
        const response = await fetch("/api/appointments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        });

        const result = await response.json();
        console.log("Appointment creation response:", result);

        if (!response.ok) {
          throw new Error(result.error || "Failed to book appointment");
        }

        // Send email notification
        try {
          console.log("Attempting to send email notification...");
          await emailService.sendAppointmentEmail({
            patientName: formData.name,
            patientEmail: formData.email,
            patientPhone: formData.phone,
            appointmentType: appointmentType.name,
            practitionerName: selectedSlot.practitionerName,
            startTime: new Date(selectedSlot.startTime),
            endTime: new Date(selectedSlot.endTime),
            notes: formData.notes,
          });
          console.log("Email notification sent successfully");
          toast.success("Appointment booked and confirmation email sent!");
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Still proceed since the appointment was created successfully
          toast.success(
            "Appointment booked successfully! (Email notification failed)"
          );
        }
      }

      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to book appointment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to format a date using the client's timezone
  const formatLocalTime = (dateString: string) => {
    const date = new Date(dateString);
    // Use formatInTimeZone to ensure proper timezone display
    return formatInTimeZone(date, timeZone, "h:mm a");
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative min-h-screen sm:min-h-[auto] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">Book {appointmentType.name}</h2>
              <p className="text-gray-600">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              ×
            </button>
          </div>

          {step === "time-selection" ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Select a Time</h3>
              {isLoading ? (
                <div className="text-center py-8">
                  Loading available times...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No available time slots for this day. Please select another
                  date.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setStep("details");
                      }}
                      className={`p-4 text-center rounded-lg border transition-all ${
                        selectedSlot === slot
                          ? "bg-sky-50 border-sky-500 text-sky-700"
                          : "border-gray-200 hover:border-sky-200 hover:bg-sky-50"
                      }`}
                    >
                      <div className="font-semibold">
                        {formatLocalTime(slot.startTime)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {slot.practitionerName}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6 bg-sky-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Selected Time:</div>
                <div className="font-semibold">
                  {formatLocalTime(selectedSlot!.startTime)}{" "}
                  with {selectedSlot!.practitionerName}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    required
                    className="mt-1"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div>
                  <Label>Notes (Optional)</Label>
                  <Input
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("time-selection")}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Booking..." : "Confirm Appointment"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}