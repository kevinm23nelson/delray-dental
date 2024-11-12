"use client";
import { useEffect, useState } from "react";
import {
  HeartPulse,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Add a new SkeletonLoader component
const CalendlySkeletonLoader = () => (
  <div className="bg-white p-6 rounded-lg animate-pulse">
    {/* Header */}
    <div className="mb-8">
      <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 w-64 bg-gray-200 rounded"></div>
    </div>

    {/* Calendar Grid */}
    <div className="mb-8">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ChevronLeft className="text-gray-300" />
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <ChevronRight className="text-gray-300" />
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-4 w-8 bg-gray-200 rounded"></div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
          >
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>

    {/* Time Slots */}
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
      ))}
    </div>
  </div>
);

const CalendlyEmbed = () => {
  const [selectedEventType, setSelectedEventType] = useState("hygiene");
  const [isLoading, setIsLoading] = useState(true);

  const eventTypes = {
    hygiene: {
      url: "https://calendly.com/delraydental/hygiene-appointment",
      title: "Hygiene Appointment",
      duration: "60 min",
      description: "Professional cleaning and preventive care",
      icon: HeartPulse,
    },
    dental: {
      url: "https://calendly.com/delraydental/dental-appointment",
      title: "Dental Appointment",
      duration: "60 min",
      description: "Dental procedures and treatments",
      icon: ClipboardCheck,
    },
  };

  useEffect(() => {
    let timeoutId;

    const loadCalendly = async () => {
      // Set loading state
      setIsLoading(true);

      try {
        // Check if Calendly is already loaded
        if (window.Calendly) {
          initializeWidget();
          return;
        }

        // Load Calendly script if not already present
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        script.onload = () => {
          // Add a small delay to ensure Calendly is fully initialized
          timeoutId = setTimeout(() => {
            initializeWidget();
          }, 400);
        };
        document.body.appendChild(script);
      } catch (error) {
        console.error("Error loading Calendly:", error);
        setIsLoading(false);
      }
    };

    const initializeWidget = () => {
      const widget = document.querySelector(".calendly-inline-widget");
      if (widget && window.Calendly) {
        window.Calendly.initInlineWidget({
          url: eventTypes[selectedEventType].url,
          parentElement: widget,
        });
        setIsLoading(false);
      }
    };

    loadCalendly();

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [selectedEventType]); // Added selectedEventType as dependency

  const handleTypeChange = (type) => {
    setIsLoading(true);
    setSelectedEventType(type);

    // The useEffect will handle re-initializing the widget
    // when selectedEventType changes
  };

  return (
    <div className="w-full animate-in fade-in duration-700 ease-in-out bg-gray-100 xl:pl-[4rem] py-12 sm:px-6 lg:px-8">
      {" "}
      {/* Added bg-gray-50 and padding */}{" "}
      {/* Main container with flex layout on large screens */}
      <div className="lg:flex lg:gap-8">
        {/* Left column for text and event types */}
        <div className="lg:w-1/3 lg:mt-[12em]">
          {/* Title and description */}
          <div className="text-center lg:text-left mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-in-out">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-montserrat mb-3">
              Schedule Your Visit Today
            </h2>
            <p className="text-lg text-gray-600">
              Select your appointment type and choose a time that works best for
              you.
            </p>
          </div>

          {/* Event Type Selection */}
          <div className="mb-6 lg:mb-0">
            <div className="flex flex-col gap-4">
              {Object.entries(eventTypes).map(([key, event]) => {
                const Icon = event.icon;
                return (
                  <button
                    key={key}
                    onClick={() => handleTypeChange(key)}
                    className={`px-6 py-4 rounded-lg transition-all duration-200 flex flex-col items-center text-center w-full ${
                      selectedEventType === key
                        ? "bg-sky-500 text-white shadow-md"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-sky-500 hover:shadow-sm"
                    }`}
                  >
                    <Icon
                      size={28}
                      className={`mb-2 ${
                        selectedEventType === key
                          ? "text-white"
                          : "text-sky-500"
                      }`}
                    />
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-sm opacity-90">{event.duration}</p>
                    <p
                      className={`text-sm mt-1 ${
                        selectedEventType === key
                          ? "text-sky-50"
                          : "text-gray-500"
                      }`}
                    >
                      {event.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column for calendar */}
        <div className="lg:w-2/3">
          <div className="bg-gray-100">
            <div className="relative">
              {" "}
              {/* Added wrapper for fade transition */}
              {isLoading && (
                <div className="absolute inset-0 z-10">
                  <CalendlySkeletonLoader />
                </div>
              )}
              <div
                className={`calendly-inline-widget scale-[.90] !overflow-hidden bg-gray-100 rounded-lg  transition-opacity duration-300 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                data-url={eventTypes[selectedEventType].url}
                style={{
                  minWidth: "320px",
                  height: "900px",
                  display: "block",
                  overflow: "hidden !important",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendlyEmbed;
