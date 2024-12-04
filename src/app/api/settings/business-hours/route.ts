import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

interface BusinessHours {
  startTime: string;
  endTime: string;
  isOpen: boolean;
}

interface BusinessHoursSettings {
  [key: string]: BusinessHours;
}

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businessHours = await prisma.officeSettings.findUnique({
      where: { name: "business_hours" },
    });

    console.log('Retrieved business hours:', businessHours);
    return NextResponse.json(businessHours?.value || getDefaultBusinessHours());
  } catch (error) {
    console.error("Failed to fetch business hours:", error);
    return NextResponse.json(
      { error: "Failed to fetch business hours" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log('Unauthorized save attempt');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    console.log('Attempting to save business hours:', data);

    const businessHours = await prisma.officeSettings.upsert({
      where: { name: "business_hours" },
      update: { 
        value: data,
        updatedAt: new Date()
      },
      create: {
        name: "business_hours",
        value: data,
      },
    });

    console.log('Successfully saved business hours:', businessHours);
    return NextResponse.json(businessHours);
  } catch (error) {
    console.error("Failed to update business hours:", error);
    return NextResponse.json(
      { error: "Failed to update business hours" },
      { status: 500 }
    );
  }
}

function getDefaultBusinessHours(): BusinessHoursSettings {
  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
  const defaultHours: BusinessHours = {
    startTime: "09:00",
    endTime: "17:00",
    isOpen: true,
  };

  return days.reduce<BusinessHoursSettings>((acc, day) => {
    acc[day] = defaultHours;
    return acc;
  }, {});
}