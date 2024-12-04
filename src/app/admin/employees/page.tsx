// src/app/admin/employees/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Users, X } from 'lucide-react';
import { PractitionerRole } from '@prisma/client';
import { formatDateForDisplay } from '@/lib/utils/dates';

interface Employee {
  id: string;
  name: string;
  role: PractitionerRole;
  phone: string;
  email?: string;
  startDate: Date;
  isActive: boolean;
}

interface NewEmployeeForm {
  name: string;
  role: PractitionerRole;
  phone: string;
  email: string;
  address: string;
}

interface AddEmployeeModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: NewEmployeeForm;
  setFormData: React.Dispatch<React.SetStateAction<NewEmployeeForm>>;
}

const AddEmployeeModal = ({ onClose, onSubmit, formData, setFormData }: AddEmployeeModalProps) => {
  const handleInputChange = (field: keyof NewEmployeeForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Employee</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: PractitionerRole) => handleInputChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {["DENTIST", "HYGIENIST", "OFFICE_STAFF"].map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0) + role.slice(1).toLowerCase().replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Employee</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<NewEmployeeForm>({
    name: "",
    role: "OFFICE_STAFF",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const response = await fetch('/api/admin/employees');
      if (!response.ok) throw new Error('Failed to load employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      toast.error('Failed to load employees');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const today = new Date();
      const startDate = today.toISOString().split('T')[0];
  
      const response = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startDate: startDate,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add employee');
      }
  
      const data = await response.json();
      setEmployees(prev => [...prev, data]);
      setFormData({
        name: "",
        role: "OFFICE_STAFF",
        phone: "",
        email: "",
        address: "",
      });
      setShowAddModal(false);
      toast.success("Employee added successfully");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to add employee');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
          <p className="text-gray-600">Total Employees: {employees.length}</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Users className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((employee) => (
          <Link href={`/admin/employees/${employee.id}`} key={employee.id}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{employee.name}</h3>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Role: {employee.role.charAt(0) + employee.role.slice(1).toLowerCase().replace('_', ' ')}</p>
                  <p>Phone: {employee.phone}</p>
                  <p>Started: {formatDateForDisplay(employee.startDate)}</p>
                </div>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs ${
                  employee.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </div>
  );
}