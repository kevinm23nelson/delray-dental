"use client";
import { useEffect, useState, useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import {
  HeartPulse,
  ClipboardCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: Element;
      }) => void;
    };
  }
}

const CalendlySkeletonLoader = () => (
  <div className="absolute inset-0 flex items-start justify-center lg:pt-[60px]">
    <div
      className="bg-white p-4 rounded-lg animate-pulse mx-auto lg:ml-[100px]"
      style={{
        width: "400px",
        height: "600px",
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="h-6 w-48 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 w-64 bg-gray-200 rounded"></div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-8">
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <ChevronLeft className="text-gray-300 h-5 w-5" />
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <ChevronRight className="text-gray-300 h-5 w-5" />
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-4 w-8 bg-gray-200 rounded mx-auto"></div>
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
  </div>
);

interface AnimatedContentProps {
  children: ReactNode;
  direction?: "left" | "right";
}

const AnimatedContent = ({ children }: AnimatedContentProps) => {
  const contentRef = useRef(null);
  const isInView = useInView(contentRef, {
    once: false,
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

type EventType = "hygiene" | "dental" | "secondaryDental";

interface CalendlyEvent {
  url: string;
  title: string;
  duration: string;
  description: string;
  icon: LucideIcon;
}

const eventTypes: Record<EventType, CalendlyEvent> = {
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
  secondaryDental: {
    url: "https://calendly.com/delraydental/secondary-dental-appointment",
    title: "Secondary Dental Appointment",
    duration: "45 min",
    description: "Follow-up dental care",
    icon: Calendar,
  },
};

const CalendlyEmbed = () => {
  const [selectedEventType, setSelectedEventType] =
    useState<EventType>("hygiene");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    const loadCalendly = async () => {
      setIsLoading(true);

      try {
        if (window.Calendly) {
          timeoutId = setTimeout(() => {
            initializeWidget();
          }, 400);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        script.onload = () => {
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
        widget.innerHTML = "";
        timeoutId = setTimeout(() => {
          window.Calendly?.initInlineWidget({
            url: eventTypes[selectedEventType].url,
            parentElement: widget,
          });
          setIsLoading(false);
        }, 500);
      }
    };

    loadCalendly();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [selectedEventType]);

  const handleTypeChange = (type: EventType) => {
    setIsLoading(true);
    setSelectedEventType(type);
  };

  return (
    <div className="w-full animate-in fade-in duration-700 ease-in-out bg-gray-100 xl:pl-[4rem] lg:px-6">
      <div className="lg:flex lg:pl-[10rem]">
        <div className="lg:w-1/3 lg:mt-[6em] pl-[1rem]">
          <AnimatedContent>
            <div className="text-center lg:text-left mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-in-out">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-montserrat mb-3">
                Schedule Your Visit Today
              </h2>
              <p className="text-lg text-gray-600">
                Select your appointment type and choose a time that works best
                for you.
              </p>
            </div>
          </AnimatedContent>

          <AnimatedContent>
            <div className="mb-6 lg:mb-0">
              <div className="flex flex-col gap-4">
                {(
                  Object.entries(eventTypes) as [EventType, CalendlyEvent][]
                ).map(([key, event]) => {
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
          </AnimatedContent>
        </div>

        <AnimatedContent>
          <div className="lg:w-2/3">
            <div className="bg-gray-100">
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 z-10">
                    <CalendlySkeletonLoader />
                  </div>
                )}
                <div
                  className={`calendly-inline-widget lg:scale-[.75] !overflow-hidden bg-gray-100 rounded-lg transition-opacity duration-300 ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}
                  data-url={eventTypes[selectedEventType].url}
                  style={{
                    minWidth: "520px",
                    height: "900px",
                    display: "block",
                    overflow: "hidden !important",
                  }}
                />
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
};

export default CalendlyEmbed;
