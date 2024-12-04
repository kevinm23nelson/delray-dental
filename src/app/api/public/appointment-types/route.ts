// src/app/api/public/appointment-types/route.ts (New public endpoint)
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const appointmentTypes = await prisma.appointmentType.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
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