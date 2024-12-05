'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';
import { DayOfWeek } from '@prisma/client';

interface Schedule {
  id?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  breakStart?: string;
  breakEnd?: string;
}

interface PractitionerScheduleProps {
  practitionerId: string;
  onClose: () => void;
}

const DEFAULT_SCHEDULE: Schedule[] = Object.values(DayOfWeek).map(day => ({
  dayOfWeek: day,
  startTime: '09:00',
  endTime: '17:00',
  isAvailable: false,
  breakStart: '12:00',
  breakEnd: '13:00',
}));

export default function PractitionerSchedule({ practitionerId, onClose }: PractitionerScheduleProps) {
  const [scheduleForm, setScheduleForm] = useState<Schedule[]>(DEFAULT_SCHEDULE);
  const [isLoading, setIsLoading] = useState(true);

  const loadPractitionerSchedule = useCallback(async () => {
    try {
      // Updated API endpoint
      const response = await fetch(`/api/admin/employees/${practitionerId}/schedule`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to load schedule');
      }
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Sort the schedule by day of week to maintain consistent order
        const sortedData = data.sort((a: Schedule, b: Schedule) => {
          const days = Object.values(DayOfWeek);
          return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
        });
        setScheduleForm(sortedData);
      }
    } catch (error) {
      console.error('Failed to load schedule:', error);
      toast.error('Failed to load schedule');
    } finally {
      setIsLoading(false);
    }
  }, [practitionerId]);

  useEffect(() => {
    loadPractitionerSchedule();
  }, [loadPractitionerSchedule]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Updated API endpoint
      const response = await fetch(`/api/admin/employees/${practitionerId}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule: scheduleForm }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update schedule');
      }
      
      toast.success('Schedule updated successfully');
      onClose();
    } catch (error) {
      console.error('Failed to update schedule:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update schedule');
    }
  }

  function updateDaySchedule(
    day: DayOfWeek,
    field: keyof Schedule,
    value: Schedule[keyof Schedule]
  ) {
    setScheduleForm(prev => 
      prev.map(schedule => 
        schedule.dayOfWeek === day 
          ? { ...schedule, [field]: value }
          : schedule
      )
    );
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.values(DayOfWeek).map((day) => (
        <div key={day} className="border p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{day}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {scheduleForm.find(s => s.dayOfWeek === day)?.isAvailable 
                  ? 'Available' 
                  : 'Unavailable'}
              </span>
              <Switch
                checked={scheduleForm.find(s => s.dayOfWeek === day)?.isAvailable ?? false}
                onCheckedChange={(checked) => updateDaySchedule(day, 'isAvailable', checked)}
              />
            </div>
          </div>

          {scheduleForm.find(s => s.dayOfWeek === day)?.isAvailable && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={scheduleForm.find(s => s.dayOfWeek === day)?.startTime}
                    onChange={(e) => updateDaySchedule(day, 'startTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={scheduleForm.find(s => s.dayOfWeek === day)?.endTime}
                    onChange={(e) => updateDaySchedule(day, 'endTime', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Break Start</Label>
                  <Input
                    type="time"
                    value={scheduleForm.find(s => s.dayOfWeek === day)?.breakStart || ''}
                    onChange={(e) => updateDaySchedule(day, 'breakStart', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Break End</Label>
                  <Input
                    type="time"
                    value={scheduleForm.find(s => s.dayOfWeek === day)?.breakEnd || ''}
                    onChange={(e) => updateDaySchedule(day, 'breakEnd', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Save Schedule
        </Button>
      </div>
    </form>
  );
}