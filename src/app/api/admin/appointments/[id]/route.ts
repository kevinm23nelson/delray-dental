// src/app/api/admin/appointments/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;
    const data = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Missing appointment ID' },
        { status: 400 }
      );
    }

    if (data.patientPhone === '') {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Only update the fields we want to change
    const appointmentData = {
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      patientPhone: data.patientPhone,
      notes: data.notes,
      status: data.status,
    };

    const appointment = await prisma.appointment.update({
      where: { id },
      data: appointmentData,
      include: {
        appointmentType: true,
        practitioner: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Failed to update appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}