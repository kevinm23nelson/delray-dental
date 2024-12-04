// src/app/api/admin/employees/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, PractitionerRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
import { standardizeDate } from "@/lib/utils/dates";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employees = await prisma.practitioner.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        phone: true,
        email: true,
        address: true,
        startDate: true,
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const data = await request.json();
    console.log("Creating employee with data:", data);
    
    if (!data.name || !data.role || !data.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Use standardizeDate to handle the date adjustment
    const employee = await prisma.practitioner.create({
      data: {
        name: data.name,
        role: data.role as PractitionerRole,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        startDate: standardizeDate(data.startDate),
        isActive: true,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Failed to create employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}