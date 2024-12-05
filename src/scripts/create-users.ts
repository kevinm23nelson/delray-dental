// src/scripts/create-users.ts
import { PrismaClient, Role, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Get password directly from process.env
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('Please set ADMIN_PASSWORD in your .env file');
  process.exit(1);
}

const users = [
  {
    email: 'drjohn@delraydental.com',
    name: 'Dr. John',
    role: 'ADMIN' as Role,
  },
  {
    email: 'olivia@delraydental.com',
    name: 'Olivia',
    role: 'ADMIN' as Role,
  },
] as const;

async function createUsers() {
  try {
    // Assert the password is a string
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD as string, 12);

    for (const user of users) {
      const userData: Prisma.UserCreateInput = {
        email: user.email,
        password: hashedPassword,
        role: user.role,
        name: user.name,
      };

      const createdUser = await prisma.user.upsert({
        where: { email: user.email },
        update: {
          password: hashedPassword,
          role: user.role,
          name: user.name,
        },
        create: userData,
      });

      console.log(`User created/updated: ${createdUser.email}`);
    }

    console.log('User creation complete');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });