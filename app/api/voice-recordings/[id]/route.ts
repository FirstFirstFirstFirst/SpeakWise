import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import { deleteVoiceRecording } from "@/services/storage";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/voice-recordings/[id] - Get a single recording
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recording = await prisma.voiceRecording.findUnique({
      where: { id: params.id },
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
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the recording
    const recording = await prisma.voiceRecording.findUnique({
      where: { id: params.id },
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
      where: { id: params.id },
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
