// src/app/api/admin/employees/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { standardizeDate } from "@/lib/utils/dates";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employee = await prisma.practitioner.findUnique({
      where: { id: params.id },
      include: {
        notes: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Failed to fetch employee:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const data = await request.json();
      console.log("Updating employee with data:", data);
  
      if (!data.name || !data.role || !data.phone) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }
  
      const employee = await prisma.practitioner.update({
        where: { id: params.id },
        data: {
          name: data.name,
          role: data.role,
          phone: data.phone,
          email: data.email || null,
          startDate: standardizeDate(data.startDate),
          address: data.address || null,
          isActive: data.isActive ?? true,
        },
        include: {
          notes: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
  
      return NextResponse.json(employee);
    } catch (error) {
      console.error("Failed to update employee:", error);
      return NextResponse.json(
        { error: "Failed to update employee" },
        { status: 500 }
      );
    }
  }

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.practitioner.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}