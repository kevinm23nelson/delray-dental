// src/app/api/admin/dashboard/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get today's date at midnight local time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get total employees count
    const totalEmployees = await prisma.practitioner.count({
      where: {
        isActive: true,
      },
    });

    // Get today's appointments count
    const todayAppointments = await prisma.appointment.count({
      where: {
        startTime: {
          gte: today,
          lt: tomorrow,
        },
        status: "SCHEDULED", // Only count confirmed appointments
      },
    });

    return NextResponse.json({
      totalEmployees,
      todayAppointments,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}