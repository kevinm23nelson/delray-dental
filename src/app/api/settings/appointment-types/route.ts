// src/app/api/settings/appointment-types/route.ts (Admin endpoint)
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appointmentTypes = await prisma.appointmentType.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(appointmentTypes);
  } catch (error) {
    console.error("Failed to fetch appointment types:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment types" },
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

    const appointmentType = await prisma.appointmentType.create({
      data: {
        name: data.name,
        duration: data.duration,
        description: data.description,
        allowedRoles: data.allowedRoles,
        isActive: true,
      },
    });

    return NextResponse.json(appointmentType);
  } catch (error) {
    console.error("Failed to create appointment type:", error);
    return NextResponse.json(
      { error: "Failed to create appointment type" },
      { status: 500 }
    );
  }
}
