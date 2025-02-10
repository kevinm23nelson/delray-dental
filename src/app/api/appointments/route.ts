// src/app/api/appointments/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    const appointment = await prisma.appointment.create({
      data: {
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
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

    return NextResponse.json({ 
      success: true, 
      message: 'Appointment booked successfully',
      appointment 
    });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}