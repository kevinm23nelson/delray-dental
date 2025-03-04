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

    // Store dates in their original format without timezone adjustment
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    console.log('Storing appointment with times:', {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
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

    return NextResponse.json({ 
      success: true, 
      message: 'Appointment booked successfully',
      appointment: {
        ...appointment,
        // Return the dates in ISO format, which will be properly interpreted by the client
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