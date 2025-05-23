import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import { uploadVoiceRecording, deleteVoiceRecording } from "@/services/storage";

// POST /api/voice-recordings - Create a new recording
export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const audioBlob = formData.get("audio") as Blob;
    const duration = parseInt(formData.get("duration") as string);
    const languageDialect = formData.get("languageDialect") as string;

    if (!audioBlob || !duration) {
      return NextResponse.json(
        { error: "Audio and duration are required" },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blobData = await uploadVoiceRecording(
      audioBlob,
      userId,
      duration,
      languageDialect
    );

    // Save to database
    const recording = await prisma.voiceRecording.create({
      data: {
        userId,
        blobUrl: blobData.url,
        blobPathname: blobData.id,
        duration,
        languageDialect,
      },
    });

    return NextResponse.json(recording);
  } catch (error) {
    console.error("Error creating voice recording:", error);
    return NextResponse.json(
      { error: "Failed to create recording" },
      { status: 500 }
    );
  }
}

// GET /api/voice-recordings - List user's recordings
export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recordings = await prisma.voiceRecording.findMany({
      where: { userId },
      include: { feedback: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(recordings);
  } catch (error) {
    console.error("Error listing voice recordings:", error);
    return NextResponse.json(
      { error: "Failed to list recordings" },
      { status: 500 }
    );
  }
}
