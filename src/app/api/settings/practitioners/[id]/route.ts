// src/app/api/settings/practitioners/[id]/route.ts
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

    const practitioner = await prisma.practitioner.update({
      where: { id: params.id },
      data: { isActive: data.isActive },
    });

    return NextResponse.json(practitioner);
  } catch (error) {
    console.error("Failed to update practitioner:", error);
    return NextResponse.json(
      { error: "Failed to update practitioner" },
      { status: 500 }
    );
  }
}