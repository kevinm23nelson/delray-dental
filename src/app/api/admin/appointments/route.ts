// src/app/api/admin/appointments/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        appointmentType: true,
        practitioner: true,
      },
      orderBy: [
        { status: 'asc' },  
        { startTime: 'asc' },
      ],
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Failed to get appointments:', error);
    return NextResponse.json(
      { error: 'Failed to get appointments' },
      { status: 500 }
    );
  }
}