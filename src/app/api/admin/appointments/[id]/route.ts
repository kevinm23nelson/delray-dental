import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add correct types for Next.js route handlers
export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const data = await request.json();
    if (data.patientPhone === '') {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id: context.params.id },
      data,
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