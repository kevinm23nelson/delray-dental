// src/app/admin/calendar/components/AppointmentTypes.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { PractitionerRole } from '@prisma/client';

interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  description: string;
  allowedRoles: PractitionerRole[];
  isActive: boolean;
}

export default function AppointmentTypesSettings() {
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAppointmentType, setNewAppointmentType] = useState({
    name: '',
    duration: 30,
    description: '',
    allowedRoles: [] as PractitionerRole[],
  });

  useEffect(() => {
    loadAppointmentTypes();
  }, []);

  async function loadAppointmentTypes() {
    try {
      const response = await fetch('/api/settings/appointment-types');
      if (!response.ok) throw new Error('Failed to load appointment types');
      const data = await response.json();
      setAppointmentTypes(data);
    } catch (error) {
      toast.error('Failed to load appointment types');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/settings/appointment-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointmentType),
      });

      if (!response.ok) throw new Error('Failed to add appointment type');
      
      const savedAppointmentType = await response.json();
      setAppointmentTypes(prev => [...prev, savedAppointmentType]);
      setNewAppointmentType({
        name: '',
        duration: 30,
        description: '',
        allowedRoles: [],
      });
      toast.success('Appointment type added successfully');
    } catch (error) {
      toast.error('Failed to add appointment type');
      console.error(error);
    }
  }

  async function toggleAppointmentTypeStatus(id: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/settings/appointment-types/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error('Failed to update appointment type status');
      
      setAppointmentTypes(prev =>
        prev.map(type =>
          type.id === id ? { ...type, isActive: !type.isActive } : type
        )
      );
      toast.success('Appointment type status updated');
    } catch (error) {
      toast.error('Failed to update appointment type status');
      console.error(error);
    }
  }

  const durationOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Appointment Type</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newAppointmentType.name}
                  onChange={(e) => setNewAppointmentType(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  required
                  placeholder="e.g., Regular Cleaning"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select
                  value={String(newAppointmentType.duration)}
                  onValueChange={(value) => setNewAppointmentType(prev => ({
                    ...prev,
                    duration: parseInt(value)
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newAppointmentType.description}
                onChange={(e) => setNewAppointmentType(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                placeholder="Brief description of the appointment type"
              />
            </div>

            <div className="space-y-2">
              <Label>Allowed Roles</Label>
              <div className="flex gap-2">
                {Object.values(PractitionerRole).map((role) => (
                  <Button
                    key={role}
                    type="button"
                    variant={newAppointmentType.allowedRoles.includes(role) ? "default" : "outline"}
                    onClick={() => {
                      setNewAppointmentType(prev => ({
                        ...prev,
                        allowedRoles: prev.allowedRoles.includes(role)
                          ? prev.allowedRoles.filter(r => r !== role)
                          : [...prev.allowedRoles, role]
                      }));
                    }}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit">Add Appointment Type</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Appointment Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {appointmentTypes.map((type) => (
              <div
                key={type.id}
                className="py-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{type.name}</h3>
                  <p className="text-sm text-gray-500">{type.duration} minutes</p>
                  <p className="text-sm text-gray-500">{type.description}</p>
                  <div className="flex gap-1 mt-1">
                    {type.allowedRoles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-1 bg-sky-100 text-sky-800 rounded-full text-xs"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    type.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {type.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => toggleAppointmentTypeStatus(type.id, type.isActive)}
                  >
                    {type.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}