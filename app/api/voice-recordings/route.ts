import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { uploadVoiceRecording } from "@/services/storage";

// POST /api/voice-recordings - Create a new recording
export async function POST(request: Request) {
  console.log("POST /api/voice-recordings - Starting request");

  try {
    const { userId } = await auth();
    console.log("Authentication check completed", {
      userId: userId ? "authenticated" : "unauthenticated",
    });

    if (!userId) {
      console.log("Authentication failed - returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Parsing form data...");
    const formData = await request.formData();
    const audioBlob = formData.get("audio") as Blob;
    const duration = parseInt(formData.get("duration") as string);
    const languageDialect = formData.get("languageDialect") as string;

    console.log("Form data parsed", {
      audioBlobSize: audioBlob?.size,
      audioBlobType: audioBlob?.type,
      duration,
      languageDialect,
    });

    if (!audioBlob || !duration) {
      console.log("Validation failed - missing required fields", {
        hasAudio: !!audioBlob,
        hasDuration: !!duration,
      });
      return NextResponse.json(
        { error: "Audio and duration are required" },
        { status: 400 }
      );
    }

    console.log("Starting blob upload to Vercel Blob...");
    // Upload to Vercel Blob
    const blobData = await uploadVoiceRecording(
      audioBlob,
      userId,
      duration,
      languageDialect
    );
    console.log("Blob upload completed", {
      blobUrl: blobData.url,
      blobId: blobData.id,
    });

    console.log("Saving recording to database...");
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
    console.log("Recording saved to database", {
      recordingId: recording.id,
      createdAt: recording.createdAt,
    });

    console.log("POST /api/voice-recordings - Request completed successfully");
    return NextResponse.json(recording);
  } catch (error) {
    console.error("Error creating voice recording:", error);
    console.log("POST /api/voice-recordings - Request failed with error", {
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to create recording" },
      { status: 500 }
    );
  }
}

// GET /api/voice-recordings - List user's recordings
export async function GET() {
  console.log("GET /api/voice-recordings - Starting request");

  try {
    const { userId } = await auth();
    console.log("Authentication check completed", {
      userId: userId ? "authenticated" : "unauthenticated",
    });

    if (!userId) {
      console.log("Authentication failed - returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching recordings from database...");
    const recordings = await prisma.voiceRecording.findMany({
      where: { userId },
      include: { feedback: true },
      orderBy: { createdAt: "desc" },
    });

    console.log("Recordings fetched successfully", {
      recordingCount: recordings.length,
    });

    console.log("GET /api/voice-recordings - Request completed successfully");
    return NextResponse.json(recordings);
  } catch (error) {
    console.error("Error listing voice recordings:", error);
    console.log("GET /api/voice-recordings - Request failed with error", {
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to list recordings" },
      { status: 500 }
    );
  }
}
