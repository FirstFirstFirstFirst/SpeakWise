import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { deleteVoiceRecording } from "@/services/storage";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/voice-recordings/[id] - Get a single recording
export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const recording = await prisma.voiceRecording.findUnique({
      where: { id },
      include: { feedback: true },
    });

    if (!recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (recording.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(recording);
  } catch (error) {
    console.error("Error getting voice recording:", error);
    return NextResponse.json(
      { error: "Failed to get recording" },
      { status: 500 }
    );
  }
}

// DELETE /api/voice-recordings/[id] - Delete a recording
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // Get the recording
    const recording = await prisma.voiceRecording.findUnique({
      where: { id },
    });

    if (!recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (recording.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete from Vercel Blob
    await deleteVoiceRecording(recording.blobPathname);

    // Delete from database (this will cascade to feedback)
    await prisma.voiceRecording.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting voice recording:", error);
    return NextResponse.json(
      { error: "Failed to delete recording" },
      { status: 500 }
    );
  }
}
