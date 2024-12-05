// src/app/api/settings/practitioners/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, PractitionerRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    console.log('Received practitioner data:', data); // Debug log

    // Validate required fields
    if (!data.name || !data.role || !data.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const practitioner = await prisma.practitioner.create({
      data: {
        name: data.name,
        role: data.role as PractitionerRole,
        phone: data.phone,
        email: data.email,
        address: data.address,
        startDate: data.startDate || new Date(),
        isActive: true,
      },
    });

    console.log('Created practitioner:', practitioner); // Debug log
    return NextResponse.json(practitioner);
  } catch (error) {
    console.error("Failed to create practitioner:", error); // Detailed error log
    return NextResponse.json(
      { error: "Failed to create practitioner", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const practitioners = await prisma.practitioner.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(practitioners);
  } catch (error) {
    console.error("Failed to fetch practitioners:", error);
    return NextResponse.json(
      { error: "Failed to fetch practitioners" },
      { status: 500 }
    );
  }
}