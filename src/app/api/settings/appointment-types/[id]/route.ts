// src/app/api/settings/appointment-types/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

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

    const appointmentType = await prisma.appointmentType.update({
      where: { id: params.id },
      data: { isActive: data.isActive },
    });

    return NextResponse.json(appointmentType);
  } catch (error) {
    console.error("Failed to update appointment type:", error);
    return NextResponse.json(
      { error: "Failed to update appointment type" },
      { status: 500 }
    );
  }
}