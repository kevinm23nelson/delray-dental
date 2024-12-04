// src/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Users, Calendar } from "lucide-react";

interface DashboardData {
  totalEmployees: number;
  todayAppointments: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    totalEmployees: 0,
    todayAppointments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();

    // Set up polling every minute to keep the dashboard updated
    const interval = setInterval(loadDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadDashboardData() {
    try {
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) throw new Error("Failed to load dashboard data");
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to update dashboard");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-sky-50 p-6 rounded-xl border border-sky-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Users className="h-5 w-5 text-sky-600" />
            </div>
            <h3 className="text-lg font-semibold text-sky-900">
              Total Employees
            </h3>
          </div>
          <p className="text-3xl font-bold text-sky-600">
            {isLoading ? "..." : data.totalEmployees}
          </p>
        </div>

        <div className="bg-sky-50 p-6 rounded-xl border border-sky-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Calendar className="h-5 w-5 text-sky-600" />
            </div>
            <h3 className="text-lg font-semibold text-sky-900">
              Today&apos;s Appointments
            </h3>
          </div>
          <p className="text-3xl font-bold text-sky-600">
            {isLoading ? "..." : data.todayAppointments}
          </p>
        </div>

        <div className="bg-sky-50 p-6 rounded-xl border border-sky-100">
          <h3 className="text-lg font-semibold text-sky-900 mb-2">
            Total Patients
          </h3>
          <p className="text-3xl font-bold text-sky-600">0</p>
        </div>
      </div>
    </div>
  );
}