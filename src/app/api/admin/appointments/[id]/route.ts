import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string }}
): Promise<NextResponse> {
  try {
    const data = await req.json();
    if (data.patientPhone === '') {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id: params.id },
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