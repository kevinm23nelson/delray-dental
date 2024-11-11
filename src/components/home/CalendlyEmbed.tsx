// src/components/home/CalendlyEmbed.tsx
"use client";
import { useEffect, useState } from "react";
import { HeartPulse, ClipboardCheck } from "lucide-react";

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
    const loadCalendly = () => {
      // Clear any existing widgets
      const existingScript = document.getElementById("calendly-script");
      if (existingScript) {
        existingScript.remove();
      }

      // Create and load new script
      const script = document.createElement("script");
      script.id = "calendly-script";
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.onload = () => {
        setIsLoading(false);
      };
      document.body.appendChild(script);
    };

    loadCalendly();

    return () => {
      const script = document.getElementById("calendly-script");
      if (script) {
        script.remove();
      }
    };
  }, []);

  const handleTypeChange = (type) => {
    setSelectedEventType(type);
    const widget = document.querySelector(".calendly-inline-widget");
    if (widget) {
      widget.innerHTML = ""; // Clear the current widget
      widget.setAttribute("data-url", eventTypes[type].url);
      // Reinitialize Calendly for the new URL
      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url: eventTypes[type].url,
          parentElement: widget,
        });
      }
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-700 ease-in-out bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"> {/* Added bg-gray-50 and padding */}      {/* Main container with flex layout on large screens */}
      <div className="lg:flex lg:gap-8">
        {/* Left column for text and event types */}
        <div className="lg:w-1/3 lg:mt-[12em]">
          {/* Title and description */}
          <div className="text-center lg:text-left mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-in-out">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-montserrat mb-3">
              Schedule Your Visit Today
            </h2>
            <p className="text-lg text-gray-600">
              Select your appointment type and choose a time that works best for you.
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
                        selectedEventType === key ? "text-white" : "text-sky-500"
                      }`}
                    />
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-sm opacity-90">{event.duration}</p>
                    <p
                      className={`text-sm mt-1 ${
                        selectedEventType === key ? "text-sky-50" : "text-gray-500"
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
          {/* Calendly Embed */}
          <div className="bg-gray-100">
            {isLoading && (
              <div className="flex items-center justify-center h-[600px] bg-white">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mb-3"></div>
                  <p className="text-gray-600">Loading calendar...</p>
                </div>
              </div>
            )}
            <div 
              className="calendly-inline-widget !overflow-hidden"
              data-url={eventTypes[selectedEventType].url}
              style={{ 
                minWidth: '320px',
                height: '900px',
                display: isLoading ? 'none' : 'block',
                overflow: 'hidden !important'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendlyEmbed;
