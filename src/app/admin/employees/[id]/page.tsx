// src/app/admin/employees/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
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
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import PractitionerSchedule from "../../calendar/components/PractitionerSchedule";
import { PractitionerRole } from "@prisma/client";
import {
  Briefcase, // for Role
  Phone, // for Phone
  Mail, // for Email
  Calendar, // for Start Date
  Home, // for Address
  StickyNote, // for Notes
} from "lucide-react";
import { formatDateForInput, formatDateForDisplay } from "@/lib/utils/dates";

interface EditFormData {
  name: string;
  role: PractitionerRole;
  phone: string;
  email?: string;
  address?: string;
  startDate: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

interface NoteItemProps {
  note: Note;
  practitionerId: string;
  onNoteUpdate: (updatedNote: Note) => void;
}

interface EmployeeDetails {
  id: string;
  name: string;
  role: PractitionerRole;
  phone: string;
  email?: string;
  address?: string;
  startDate: string;
  isActive: boolean;
  notes: Note[];
}

function isString(value: string | string[] | undefined): value is string {
  return typeof value === "string";
}

export default function EmployeeDetailsPage() {
  const params = useParams();
  const employeeId = isString(params.id) ? params.id : "";
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    name: "",
    role: "OFFICE_STAFF",
    phone: "",
    email: "",
    address: "",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const ALL_ROLES = ["DENTIST", "HYGIENIST", "OFFICE_STAFF"] as const;

  const NoteItem = ({ note, practitionerId, onNoteUpdate }: NoteItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(note.content);

    return (
      <div className="border-b pb-3">
        {isEditing ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const response = await fetch(
                  `/api/admin/employees/${practitionerId}/notes/${note.id}`,
                  {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: editContent }),
                  }
                );

                if (!response.ok) throw new Error("Failed to update note");

                const updatedNote = await response.json();
                onNoteUpdate(updatedNote);
                setIsEditing(false);
                toast.success("Note updated successfully");
              } catch (error) {
                toast.error("Failed to update note");
                console.error(error);
              }
            }}
            className="flex gap-2"
          >
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(note.content);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <p className="text-gray-700">{note.content}</p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Added by {note.createdBy} on{" "}
              {new Date(note.createdAt).toLocaleString()}
            </div>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (employee) {
      setEditForm({
        ...employee,
        startDate: formatDateForInput(employee.startDate),
      });
    }
  }, [employee]);


  const loadEmployeeDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/employees/${employeeId}`);
      if (!response.ok) throw new Error("Failed to load employee details");
      const data = await response.json();
      setEmployee(data);
      setEditForm(data);
    } catch (error) {
      toast.error("Failed to load employee details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    loadEmployeeDetails();
  }, [loadEmployeeDetails]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/employees/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          startDate: editForm.startDate,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update employee");
      }

      const updatedEmployee = await response.json();
      setEmployee((prev) => ({
        ...updatedEmployee,
        notes: updatedEmployee.notes || prev?.notes || [],
      }));
      setIsEditing(false);
      toast.success("Employee updated successfully");
    } catch (error) {
      console.error("Failed to update employee:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update employee"
      );
    }
  }

  async function handleDelete() {
    try {
      const response = await fetch(`/api/admin/employees/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete employee");

      toast.success("Employee deleted successfully");
      router.push("/admin/employees");
    } catch (error) {
      toast.error("Failed to delete employee");
      console.error(error);
    }
  }

  if (isLoading || !employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/employees")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Employees
          </Button>
          <h2 className="text-2xl font-bold text-gray-800">{employee.name}</h2>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="p-6">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Briefcase className="h-4 w-4 text-sky-500" />
                  </div>
                  Name
                </Label>
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Briefcase className="h-4 w-4 text-sky-500" />
                  </div>
                  Role
                </Label>
                <Select
                  value={editForm.role}
                  onValueChange={(value: PractitionerRole) =>
                    setEditForm((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0) +
                          role.slice(1).toLowerCase().replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Phone className="h-4 w-4 text-sky-500" />
                  </div>
                  Phone
                </Label>
                <Input
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Mail className="h-4 w-4 text-sky-500" />
                  </div>
                  Email
                </Label>
                <Input
                  value={editForm.email || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-sky-500" />
                  </div>
                  Start Date
                </Label>
                <Input
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Home className="h-4 w-4 text-sky-500" />
                  </div>
                  Address
                </Label>
                <Input
                  value={editForm.address || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Briefcase className="h-4 w-4 text-sky-500" />
                  </div>
                  Role
                </Label>
                <p className="mt-1">
                  {employee.role.charAt(0) +
                    employee.role.slice(1).toLowerCase().replace("_", " ")}
                </p>
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Phone className="h-4 w-4 text-sky-500" />
                  </div>
                  Phone
                </Label>
                <p className="mt-1">{employee.phone}</p>
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Mail className="h-4 w-4 text-sky-500" />
                  </div>
                  Email
                </Label>
                <p className="mt-1">{employee.email || "Not provided"}</p>
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-sky-500" />
                  </div>
                  Start Date
                </Label>
                <p className="mt-1">
                  {formatDateForDisplay(employee.startDate)}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Home className="h-4 w-4 text-sky-500" />
                  </div>
                  Address
                </Label>
                <p className="mt-1">{employee.address || "Not provided"}</p>
              </div>
            </div>

            {(employee.role === "DENTIST" || employee.role === "HYGIENIST") && (
              <Button
                className="mt-4"
                onClick={() => setShowScheduleModal(true)}
              >
                Manage Schedule
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Notes Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className="p-2 bg-sky-50 rounded-lg">
            <StickyNote className="h-4 w-4 text-sky-500" />
          </div>
          Notes
        </h3>
        <div className="space-y-4">
          {/* Add Note Form */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const noteInput = form.elements.namedItem(
                "note"
              ) as HTMLInputElement;

              try {
                const response = await fetch(
                  `/api/admin/employees/${employeeId}/notes`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: noteInput.value }),
                  }
                );

                if (!response.ok) throw new Error("Failed to add note");

                const newNote = await response.json();
                setEmployee((prev) => {
                  if (!prev) return null;
                  return {
                    ...prev,
                    notes: [...(prev.notes || []), newNote].sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    ),
                  };
                });

                noteInput.value = "";
                toast.success("Note added successfully");
              } catch (error) {
                toast.error("Failed to add note");
                console.error(error);
              }
            }}
            className="flex gap-2"
          >
            <Input name="note" placeholder="Add a note..." required />
            <Button type="submit">Add Note</Button>
          </form>

          {/* Notes List */}
          <div className="space-y-4 mt-4">
            {employee?.notes?.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                practitionerId={employeeId}
                onNoteUpdate={(updatedNote) => {
                  setEmployee((prev) =>
                    prev
                      ? {
                          ...prev,
                          notes: prev.notes.map((n) =>
                            n.id === updatedNote.id ? updatedNote : n
                          ),
                        }
                      : null
                  );
                }}
              />
            ))}
            {(!employee?.notes || employee.notes.length === 0) && (
              <p className="text-gray-500 text-center py-4">No notes yet</p>
            )}
          </div>
        </div>
      </Card>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
            <p>
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative h-full flex items-center justify-center overflow-y-auto py-6">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] my-auto">
              <div className="p-6 flex flex-col max-h-[90vh]">
                <div className="overflow-y-auto">
                  <PractitionerSchedule
                    practitionerId={employee.id}
                    onClose={() => setShowScheduleModal(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
