// src/app/admin/calendar/components/BusinessHours.tsx
'use client';

import { useState, useEffect } from 'react';
import { calendarApi } from '@/lib/api';
import type { BusinessHours } from '@/types/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function BusinessHoursSettings() {
  const [businessHours, setBusinessHours] = useState<BusinessHours>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadBusinessHours();
  }, []);

  async function loadBusinessHours() {
    try {
      const data = await calendarApi.getBusinessHours();
      setBusinessHours(data);
    } catch (error) {
      console.error('Failed to load business hours:', error);
      toast.error('Failed to load business hours');
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await calendarApi.updateBusinessHours(businessHours);
      toast.success('Business hours updated successfully');
    } catch (error) {
      console.error('Failed to update business hours:', error);
      toast.error('Failed to update business hours');
    } finally {
      setIsSaving(false);
    }
  }

  function handleTimeChange(
    day: string,
    field: 'startTime' | 'endTime',
    value: string
  ) {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].map(day => (
            <div key={day} className="flex items-center gap-4">
              <span className="w-24 font-medium">{day}</span>
              <input
                type="time"
                className="border rounded p-2"
                value={businessHours[day]?.startTime || '09:00'}
                onChange={e => handleTimeChange(day, 'startTime', e.target.value)}
              />
              <span>to</span>
              <input
                type="time"
                className="border rounded p-2"
                value={businessHours[day]?.endTime || '17:00'}
                onChange={e => handleTimeChange(day, 'endTime', e.target.value)}
              />
            </div>
          ))}
          <Button 
            type="submit" 
            disabled={isSaving}
            className="mt-4"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}