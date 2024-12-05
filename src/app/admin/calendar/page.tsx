// src/app/admin/calendar/page.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BusinessHoursSettings from './components/BusinessHours';
import PractitionersSettings from './components/Practitioners';
import AppointmentTypesSettings from './components/AppointmentTypes';

export default function CalendarSettings() {
  const [activeTab, setActiveTab] = useState('business-hours');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Calendar Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="business-hours">Business Hours</TabsTrigger>
          <TabsTrigger value="practitioners">Practitioners</TabsTrigger>
          <TabsTrigger value="appointment-types">Appointment Types</TabsTrigger>
        </TabsList>

        <TabsContent value="business-hours">
          <BusinessHoursSettings />
        </TabsContent>

        <TabsContent value="practitioners">
          <PractitionersSettings />
        </TabsContent>

        <TabsContent value="appointment-types">
          <AppointmentTypesSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}