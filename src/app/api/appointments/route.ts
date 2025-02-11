// src/app/api/appointments/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { addHours } from 'date-fns';

const prisma = new PrismaClient();
const TIMEZONE = 'America/New_York';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received appointment data:', data);

    if (!data.startTime || !data.endTime || !data.practitionerId || 
        !data.appointmentTypeId || !data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse the dates and add 5 hours to compensate for UTC conversion
    const startTime = addHours(new Date(data.startTime), 5);
    const endTime = addHours(new Date(data.endTime), 5);

    const appointment = await prisma.appointment.create({
      data: {
        startTime,
        endTime,
        patientName: data.name,
        patientEmail: data.email,
        patientPhone: data.phone,  
        notes: data.notes,
        practitionerId: data.practitionerId,
        typeId: data.appointmentTypeId,
        status: 'PENDING',
      },
      include: {
        appointmentType: true,
        practitioner: true,
      },
    });

    // Convert the times back to Eastern for the response
    const startTimeET = toZonedTime(appointment.startTime, TIMEZONE);
    const endTimeET = toZonedTime(appointment.endTime, TIMEZONE);

    return NextResponse.json({ 
      success: true, 
      message: 'Appointment booked successfully',
      appointment: {
        ...appointment,
        startTime: formatInTimeZone(
          startTimeET,
          TIMEZONE,
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        ),
        endTime: formatInTimeZone(
          endTimeET,
          TIMEZONE,
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        ),
      }
    });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}