import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth/[...nextauth]/auth";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract IDs from the URL path
    const pathParts = req.url.split('/');
    const employeeId = pathParts[pathParts.indexOf('employees') + 1];
    const noteId = pathParts.pop();

    if (!employeeId || !noteId) {
      return NextResponse.json(
        { error: "Employee ID and Note ID are required" },
        { status: 400 }
      );
    }

    const { content } = await req.json();
    if (!content) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

    const note = await prisma.practitionerNote.update({
      where: {
        id: noteId,
        practitionerId: employeeId,
      },
      data: { content },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("Failed to update note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}