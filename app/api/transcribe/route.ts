import { NextRequest, NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";
import fs from "fs";
import path from "path";
import { cleanupUploadsDirectory } from "@/utils/cleanup-uploads-dir";

const client = new AssemblyAI({
  apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY as string,
});

export async function POST(request: NextRequest) {
  try {
    console.log("transcribe being called");
    const { audioUrl } = await request.json();
    console.log("got audio URL:", audioUrl);

    if (!audioUrl) {
      return NextResponse.json(
        { error: "No audio URL provided" },
        { status: 400 }
      );
    }

    // Get the filename from the URL
    const filename = audioUrl.split("/").pop();
    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Audio file not found" },
        { status: 404 }
      );
    }

    console.log("Reading file:", filePath);

    // Read the file directly and upload using direct upload
    const file = fs.readFileSync(filePath);

    // Upload file directly to AssemblyAI
    const uploadResponse = await client.files.upload(file);

    console.log("File uploaded to AssemblyAI:", uploadResponse);

    // Configure transcription with the uploaded file
    const config = {
      audio_url: uploadResponse, // Use the URL provided by AssemblyAI
      language_code: "en",
      punctuate: true,
      format_text: true,
    };

    console.log("Sending to AssemblyAI for transcription");
    // Send to AssemblyAI for transcription
    const transcript = await client.transcripts.transcribe(config);
    console.log("Received transcript response");
    cleanupUploadsDirectory();
    // Process the transcript to get our response data
    return NextResponse.json({
      transcript: transcript.text,
      duration: Math.ceil(transcript.audio_duration ?? 0),
    });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return NextResponse.json(
      { error: "Error transcribing audio" },
      { status: 500 }
    );
  }
}
