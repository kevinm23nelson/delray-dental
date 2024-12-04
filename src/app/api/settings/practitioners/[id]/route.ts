import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/auth";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Practitioner ID is required" },
        { status: 400 }
      );
    }

    const data = await req.json();

    const practitioner = await prisma.practitioner.update({
      where: { id },
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