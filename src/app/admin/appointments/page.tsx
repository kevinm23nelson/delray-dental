// src/app/admin/appointments/page.tsx
"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import AppointmentModal from "./components/AppointmentModal";
import type { Appointment } from "@/types/calendar";
import { AppointmentStatus } from "@prisma/client";
import { EventClickArg } from "@fullcalendar/core";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      const response = await fetch("/api/admin/appointments");
      if (!response.ok) throw new Error("Failed to load appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  }

  const events = appointments.map((appointment) => ({
    id: appointment.id,
    title: `${appointment.patientName} (${appointment.practitioner.name})`,
    start:
      typeof appointment.startTime === "string"
        ? new Date(appointment.startTime)
        : appointment.startTime,
    end:
      typeof appointment.endTime === "string"
        ? new Date(appointment.endTime)
        : appointment.endTime,
    backgroundColor: getStatusColor(appointment.status),
    extendedProps: {
      ...appointment,
    },
  }));

  function getStatusColor(status: AppointmentStatus) {
    switch (status) {
      case "PENDING":
        return "#FCD34D"; // Yellow
      case "SCHEDULED":
        return "#60A5FA"; // Blue
      case "COMPLETED":
        return "#34D399"; // Green
      case "CANCELLED":
        return "#F87171"; // Red
      default:
        return "#60A5FA";
    }
  }

  function handleEventClick(info: EventClickArg) {
    const appointment = appointments.find((a) => a.id === info.event.id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setShowModal(true);
    }
  }

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appointments Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
            slotMinTime="09:00:00"
            slotMaxTime="17:00:00"
            allDaySlot={false}
            eventClick={handleEventClick}
            events={events}
            height="auto"
            expandRows={true}
            slotDuration="00:15:00"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: "09:00",
              endTime: "17:00",
            }}
          />
        </CardContent>
      </Card>

      {showModal && selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowModal(false);
            setSelectedAppointment(null);
          }}
          onSave={async (updatedAppointment) => {
            try {
              const response = await fetch(
                `/api/admin/appointments/${selectedAppointment.id}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updatedAppointment),
                }
              );

              if (!response.ok) throw new Error("Failed to update appointment");

              toast.success("Appointment updated successfully");
              loadAppointments();
              setShowModal(false);
            } catch (error) {
              console.error("Failed to update appointment:", error);
              toast.error("Failed to update appointment");
            }
          }}
        />
      )}
    </div>
  );
}
