// src/app/admin/calendar/components/Practitioners.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { PractitionerRole } from "@prisma/client";
import PractitionerSchedule from "./PractitionerSchedule";

// Define clinical roles type
type ClinicalRole = "DENTIST" | "HYGIENIST";
const CLINICAL_ROLES = ["DENTIST", "HYGIENIST"] as const;

// Type guard function
function isClinicalRole(role: PractitionerRole): role is ClinicalRole {
  return CLINICAL_ROLES.includes(role as ClinicalRole);
}

interface Practitioner {
  id: string;
  name: string;
  role: PractitionerRole;
  phone: string;
  email?: string;
  address?: string;
  startDate: Date;
  isActive: boolean;
}

interface NewPractitionerForm {
  name: string;
  role: PractitionerRole;
  phone: string;
  email: string;
  address: string;
}


export default function PractitionersSettings() {
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPractitionerId, setSelectedPractitionerId] = useState<
    string | null
  >(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newPractitioner, setNewPractitioner] = useState<NewPractitionerForm>({
    name: "",
    role: "DENTIST",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    loadPractitioners();
  }, []);

  async function loadPractitioners() {
    try {
      const response = await fetch("/api/settings/practitioners");
      if (!response.ok) throw new Error("Failed to load practitioners");
      const data = await response.json();
      // Filter for only clinical roles using the type guard
      const clinicalPractitioners = data.filter((p: Practitioner) =>
        isClinicalRole(p.role)
      );
      setPractitioners(clinicalPractitioners);
    } catch (error) {
      toast.error("Failed to load practitioners");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch("/api/settings/practitioners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPractitioner,
          startDate: new Date(),
          phone: newPractitioner.phone || "000-000-0000",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add practitioner");
      }

      setPractitioners((prev) => [...prev, data]);
      setNewPractitioner({
        name: "",
        role: "DENTIST",
        phone: "",
        email: "",
        address: "",
      });
      toast.success("Practitioner added successfully");
    } catch (error) {
      console.error("Error adding practitioner:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add practitioner"
      );
    }
  }

  async function togglePractitionerStatus(id: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/settings/practitioners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update practitioner status");

      setPractitioners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
      );
      toast.success("Practitioner status updated");
    } catch (error) {
      toast.error("Failed to update practitioner status");
      console.error(error);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Practitioner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newPractitioner.name}
                  onChange={(e) =>
                    setNewPractitioner((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newPractitioner.role}
                  onValueChange={(value: PractitionerRole) =>
                    setNewPractitioner((prev) => ({
                      ...prev,
                      role: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DENTIST">Dentist</SelectItem>
                    <SelectItem value="HYGIENIST">Hygienist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit">Add Practitioner</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Practitioners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {practitioners.map((practitioner) => (
              <div
                key={practitioner.id}
                className="py-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{practitioner.name}</h3>
                  <p className="text-sm text-gray-500">{practitioner.role}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPractitionerId(practitioner.id);
                      setShowScheduleModal(true);
                    }}
                  >
                    Manage Schedule
                  </Button>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      practitioner.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {practitioner.isActive ? "Active" : "Inactive"}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      togglePractitionerStatus(
                        practitioner.id,
                        practitioner.isActive
                      )
                    }
                  >
                    {practitioner.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showScheduleModal && selectedPractitionerId && (
        <div className="fixed inset-0 z-[999]">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Modal Wrapper */}
          <div className="relative h-full flex items-center justify-center">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Manage Schedule</h2>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setSelectedPractitionerId(null);
                  }}
                >
                  Close
                </Button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                <PractitionerSchedule
                  practitionerId={selectedPractitionerId}
                  onClose={() => {
                    setShowScheduleModal(false);
                    setSelectedPractitionerId(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
