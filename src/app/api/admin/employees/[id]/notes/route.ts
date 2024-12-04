import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the `id` parameter from the URL
    const { pathname } = new URL(request.url);
    const match = pathname.match(/\/api\/admin\/employees\/(?<id>[^/]+)\/notes/);

    if (!match || !match.groups?.id) {
      return NextResponse.json(
        { error: "Invalid URL or missing employee ID" },
        { status: 400 }
      );
    }

    const { id } = match.groups;
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

    const note = await prisma.practitionerNote.create({
      data: {
        content,
        practitionerId: id,
        createdBy: session.user.email,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the `id` parameter from the URL
    const { pathname } = new URL(request.url);
    const match = pathname.match(/\/api\/admin\/employees\/(?<id>[^/]+)\/notes/);

    if (!match || !match.groups?.id) {
      return NextResponse.json(
        { error: "Invalid URL or missing employee ID" },
        { status: 400 }
      );
    }

    const { id } = match.groups;

    const notes = await prisma.practitionerNote.findMany({
      where: {
        practitionerId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}