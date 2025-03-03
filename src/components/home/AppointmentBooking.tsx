// src/components/home/AppointmentBooking.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HeartPulse, ClipboardCheck } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-hot-toast";
import BookingModal from "./BookingModal";
import { PractitionerRole } from "@prisma/client";
import type { DateClickArg } from "@fullcalendar/interaction";

interface AppointmentTypeFromDB {
  id: string;
  name: string;
  duration: number;
  description: string;
  allowedRoles: PractitionerRole[];
  isActive: boolean;
}

const AnimatedContent = ({ children }: { children: React.ReactNode }) => {
  const contentRef = useRef(null);
  const isInView = useInView(contentRef, {
    once: true,
    margin: "-100px",
    amount: 0.3,
  });

  const variants = {
    hidden: {
      opacity: 0,
      x: 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={contentRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default function AppointmentBooking() {
  const [appointmentTypes, setAppointmentTypes] = useState<
    AppointmentTypeFromDB[]
  >([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAppointmentTypes();
  }, []);

  useEffect(() => {
    if (selectedType) {
      console.log("Selected appointment type:", selectedType);
      console.log("All appointment types:", appointmentTypes);
    }
  }, [selectedType, appointmentTypes]);

  async function loadAppointmentTypes() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/public/appointment-types");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load appointment types");
      }

      const data = await response.json();
      console.log("Loaded appointment types:", data);

      if (!Array.isArray(data)) {
        throw new Error("Invalid appointment types data received");
      }

      setAppointmentTypes(data);

      if (data.length > 0) {
        setSelectedType(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load appointment types:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load appointment types"
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleDateClick(arg: DateClickArg) {
    const selectedDate = new Date(arg.date);
    console.log("Selected date:", selectedDate.toISOString());
    setSelectedDate(selectedDate);
    setShowBookingModal(true);
  }

  function getIconForType(name: string) {
    return name.toLowerCase().includes("hygiene") ? HeartPulse : ClipboardCheck;
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Loading appointment types...</div>
      </div>
    );
  }

  if (appointmentTypes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">No appointment types available.</div>
      </div>
    );
  }
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="lg:flex lg:gap-8 lg:items-start">
          {/* Left Column - Appointment Types */}
          <div className="lg:w-[350px] mb-8 lg:mb-0">
            {" "}
            <AnimatedContent>
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-900 font-montserrat mb-4">
                  Schedule Your Visit Today
                </h2>
                <p className="text-lg text-gray-600">
                  Select your appointment type and choose a time that works best
                  for you.
                </p>
              </div>

              <div className="space-y-4">
                {appointmentTypes.map((type) => {
                  const Icon = getIconForType(type.name);
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full p-6 rounded-xl transition-all duration-200 flex flex-col items-center text-center ${
                        selectedType === type.id
                          ? "bg-sky-500 text-white shadow-lg transform hover:scale-[1.02]"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-sky-500 hover:shadow-md"
                      }`}
                    >
                      <Icon
                        size={36}
                        className={`mb-3 ${
                          selectedType === type.id
                            ? "text-white"
                            : "text-sky-500"
                        }`}
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        {type.name}
                      </h3>
                      <p className="text-base opacity-90 mb-2">
                        {type.duration} minutes
                      </p>
                      <p
                        className={`text-base ${
                          selectedType === type.id
                            ? "text-sky-50"
                            : "text-gray-500"
                        }`}
                      >
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </AnimatedContent>
          </div>

          {/* Right Column - Calendar */}
          <div className="lg:flex-1 pt-5">
            <AnimatedContent>
              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
                {" "}
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth",
                  }}
                  dateClick={handleDateClick}
                  contentHeight="auto"
                  aspectRatio={1.5}
                  expandRows={true}
                  dayMaxEvents={true}
                  selectable={true}
                  selectMirror={true}
                  unselectAuto={true}
                  selectConstraint="businessHours"
                  businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5],
                    startTime: "09:00",
                    endTime: "17:00",
                  }}
                  slotMinTime="09:00:00"
                  slotMaxTime="17:00:00"
                  hiddenDays={[0, 6]}
                  dayCellClassNames={(arg) => {
                    return arg.date.getDay() === 0 || arg.date.getDay() === 6
                      ? "bg-gray-50"
                      : "cursor-pointer hover:bg-gray-50";
                  }}
                />
              </div>
            </AnimatedContent>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDate && selectedType && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          selectedDate={selectedDate}
          appointmentType={appointmentTypes.find((t) => t.id === selectedType)!}
          onBookAppointment={async (data) => {
            try {
              const response = await fetch("/api/appointments", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...data,
                  appointmentTypeId: selectedType,
                }),
              });

              const result = await response.json();

              if (!response.ok) {
                throw new Error(result.error || "Failed to book appointment");
              }

              // Only show success if we get here
              toast.success("Appointment booked successfully!");
              setShowBookingModal(false);
            } catch (error) {
              console.error("Failed to book appointment:", error);
              // Remove the generic toast.error here since the API will return specific errors
              throw error; // Re-throw to be handled by the form's error handler
            }
          }}
        />
      )}
    </div>
  );
}
