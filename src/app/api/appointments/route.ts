// src/app/api/appointments/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const prisma = new PrismaClient();
const TIMEZONE = 'America/New_York'; // Set this to your business timezone

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

    // The times coming from the client are already in UTC (ISO format)
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    console.log('Storing appointment with times:', {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      localStartTime: formatInTimeZone(startTime, TIMEZONE, 'yyyy-MM-dd HH:mm:ss'),
      localEndTime: formatInTimeZone(endTime, TIMEZONE, 'yyyy-MM-dd HH:mm:ss')
    });

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

    console.log('Created appointment with times:', {
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString(),
      localStartTime: formatInTimeZone(appointment.startTime, TIMEZONE, 'yyyy-MM-dd HH:mm:ss'),
      localEndTime: formatInTimeZone(appointment.endTime, TIMEZONE, 'yyyy-MM-dd HH:mm:ss')
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Appointment booked successfully',
      appointment: {
        ...appointment,
        startTime: appointment.startTime.toISOString(),
        endTime: appointment.endTime.toISOString(),
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const practitionerId = searchParams.get('practitionerId');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Parse the date and create start/end boundaries
    const queryDate = parseISO(date);
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Use a properly typed where clause to avoid 'any'
  const whereClause: {
    startTime: { gte: Date; lt: Date };
    practitionerId?: string;
  } = {
    startTime: {
      gte: startOfDay,
      lt: endOfDay,
    },
  };

  if (practitionerId) {
    whereClause.practitionerId = practitionerId;
  }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        appointmentType: true,
        practitioner: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Convert dates to ISO strings for JSON serialization
    const serializedAppointments = appointments.map(appointment => ({
      ...appointment,
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString(),
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedAppointments);
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}