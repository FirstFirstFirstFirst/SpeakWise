import { NextRequest, NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY as string,
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

    console.log("Sending URL directly to AssemblyAI for transcription");

    const config = {
      audio_url: audioUrl, 
      language_code: "en",
      punctuate: true,
      format_text: true,
    };

    // Send to AssemblyAI for transcription
    const transcript = await client.transcripts.transcribe(config);
    console.log("Received transcript response");

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
