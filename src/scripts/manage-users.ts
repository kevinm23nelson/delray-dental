// src/scripts/manage-users.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { randomBytes } from 'crypto';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

interface UserInput {
  email: string;
  name: string;
  role: Role;
}

const SALT_ROUNDS = 12; // Industry standard for bcrypt

// Users to create
const users: UserInput[] = [
  {
    email: 'admin@delraydental.com',
    name: 'Admin User',
    role: 'ADMIN',
  },
  {
    email: 'staff@delraydental.com',
    name: 'Staff User',
    role: 'USER',
  },
  // Add more users as needed
];

async function generateSecurePassword(): Promise<string> {
  // Generate a random 16-character password
  return randomBytes(12).toString('base64');
}

async function createOrUpdateUser(user: UserInput) {
  try {
    const password = await generateSecurePassword();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password: hashedPassword,
        role: user.role,
        name: user.name,
      },
      create: {
        email: user.email,
        password: hashedPassword,
        role: user.role,
        name: user.name,
      },
    });

    // Return both the created user and the plain text password
    return {
      user: createdUser,
      password,
    };
  } catch (error) {
    console.error(`Error creating/updating user ${user.email}:`, error);
    throw error;
  }
}

async function manageUsers() {
  try {
    console.log('Starting user management process...\n');

    for (const user of users) {
      const result = await createOrUpdateUser(user);
      console.log(`User created/updated successfully:`);
      console.log(`Email: ${result.user.email}`);
      console.log(`Name: ${result.user.name}`);
      console.log(`Role: ${result.user.role}`);
      console.log(`Temporary Password: ${result.password}`);
      console.log('----------------------------------------\n');
    }

    console.log(`
⚠️  IMPORTANT SECURITY NOTICE ⚠️
1. These are temporary passwords. Please provide them securely to each user.
2. Users should change their passwords upon first login.
3. Delete or secure this output immediately.
    `);

  } catch (error) {
    console.error('Error in user management process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if called directly (not imported)
if (require.main === module) {
  manageUsers()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}