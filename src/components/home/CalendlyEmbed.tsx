// src/components/home/CalendlyEmbed.tsx
"use client";
import { useEffect, useState } from 'react';
import { ClipboardCheck, HeartPulse } from 'lucide-react'; // Changed to available icons

const CalendlyEmbed = () => {
  const [selectedEventType, setSelectedEventType] = useState('hygiene'); // default to hygiene

  useEffect(() => {
    // Load the Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(script);
    };
  }, []);

  const eventTypes = {
    'hygiene': {
      url: 'https://calendly.com/delraydental/hygiene-appointment',
      title: 'Hygiene Appointment',
      duration: '60 min',
      description: 'Professional cleaning and preventive care',
      icon: HeartPulse
    },
    'dental': {
      url: 'https://calendly.com/delraydental/dental-appointment',
      title: 'Dental Appointment',
      duration: '60 min',
      description: 'Dental procedures and treatments',
      icon: ClipboardCheck
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-700 ease-in-out">
      {/* Event Type Selection */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {Object.entries(eventTypes).map(([key, event]) => {
            const Icon = event.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedEventType(key)}
                className={`px-8 py-6 rounded-xl transition-all duration-200 flex flex-col items-center text-center w-full sm:w-80 ${
                  selectedEventType === key
                    ? 'bg-sky-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 shadow hover:shadow-md hover:scale-102'
                }`}
              >
                <Icon size={32} className={`mb-3 ${selectedEventType === key ? 'text-white' : 'text-sky-500'}`} />
                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                <p className="text-sm opacity-90">{event.duration}</p>
                <p className={`text-sm mt-2 ${selectedEventType === key ? 'text-sky-50' : 'text-gray-500'}`}>
                  {event.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendly Embed */}
      <div className="max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-white">
        <div 
          className="calendly-inline-widget" 
          data-url={eventTypes[selectedEventType].url}
          style={{ 
            minWidth: '320px',
            height: '700px',
          }}
        />
      </div>
    </div>
  );
};

export default CalendlyEmbed;