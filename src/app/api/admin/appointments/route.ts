// src/app/api/admin/appointments/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { formatInTimeZone } from 'date-fns-tz';

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

    // Convert times to local timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formattedAppointments = appointments.map(appointment => {
      const { startTime, endTime, ...rest } = appointment;
      return {
        ...rest,
        startTime: formatInTimeZone(
          startTime,
          timeZone,
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        ),
        endTime: formatInTimeZone(
          endTime,
          timeZone,
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        ),
      };
    });

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error('Failed to get appointments:', error);
    return NextResponse.json(
      { error: 'Failed to get appointments' },
      { status: 500 }
    );
  }
}