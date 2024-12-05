// src/lib/business-hours.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getBusinessHours() {
  const settings = await prisma.officeSettings.findUnique({
    where: {
      name: 'business_hours',
    },
  });

  console.log('Current business hours:', settings);
  return settings;
}

export async function checkDatabaseConnection() {
  try {
    const result = await prisma.$queryRaw`SELECT 1+1 as result`;
    console.log('Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}