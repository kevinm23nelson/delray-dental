import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, DayOfWeek } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/auth";

interface ScheduleInput {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  breakStart?: string | null;
  breakEnd?: string | null;
}

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Practitioner ID is required" },
        { status: 400 }
      );
    }

    const schedule = await prisma.schedule.findMany({
      where: {
        practitionerId: id,
        effectiveUntil: null,
      },
      orderBy: {
        dayOfWeek: 'asc',
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Practitioner ID is required" },
        { status: 400 }
      );
    }

    const { schedule } = await req.json() as { schedule: ScheduleInput[] };

    await prisma.schedule.deleteMany({
      where: {
        practitionerId: id,
        effectiveUntil: null,
      },
    });

    const newSchedule = await Promise.all(
      schedule.map((item: ScheduleInput) =>
        prisma.schedule.create({
          data: {
            practitionerId: id,
            dayOfWeek: item.dayOfWeek,
            startTime: item.startTime,
            endTime: item.endTime,
            isAvailable: item.isAvailable,
            breakStart: item.breakStart || null,
            breakEnd: item.breakEnd || null,
          },
        })
      )
    );

    return NextResponse.json(newSchedule);
  } catch (error) {
    console.error("Failed to update schedule:", error);
    return NextResponse.json(
      { error: "Failed to update schedule" },
      { status: 500 }
    );
  }
}