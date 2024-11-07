// src/components/home/CalendlyEmbed.tsx
"use client";
import { useEffect, useState } from 'react';
import { HeartPulse, ClipboardCheck } from 'lucide-react';

const CalendlyEmbed = () => {
  const [selectedEventType, setSelectedEventType] = useState('hygiene');
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const loadCalendly = () => {
      // Clear any existing widgets
      const existingScript = document.getElementById('calendly-script');
      if (existingScript) {
        existingScript.remove();
      }

      // Create and load new script
      const script = document.createElement('script');
      script.id = 'calendly-script';
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.onload = () => {
        setIsLoading(false);
      };
      document.body.appendChild(script);
    };

    loadCalendly();

    return () => {
      const script = document.getElementById('calendly-script');
      if (script) {
        script.remove();
      }
    };
  }, []);

  const handleTypeChange = (type) => {
    setSelectedEventType(type);
    const widget = document.querySelector('.calendly-inline-widget');
    if (widget) {
      widget.innerHTML = '';  // Clear the current widget
      widget.setAttribute('data-url', eventTypes[type].url);
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
    <div className="w-full animate-in fade-in duration-700 ease-in-out">
      {/* Event Type Selection */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {Object.entries(eventTypes).map(([key, event]) => {
            const Icon = event.icon;
            return (
              <button
                key={key}
                onClick={() => handleTypeChange(key)}
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
        {isLoading && (
          <div className="flex items-center justify-center h-[700px] bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mb-4"></div>
              <p className="text-gray-600">Loading calendar...</p>
            </div>
          </div>
        )}
        <div 
          className="calendly-inline-widget"
          data-url={eventTypes[selectedEventType].url}
          style={{ 
            minWidth: '320px',
            height: '700px',
            display: isLoading ? 'none' : 'block'
          }}
        />
      </div>
    </div>
  );
};

export default CalendlyEmbed;