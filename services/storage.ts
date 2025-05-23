import { PutBlobResult, del, list, put } from "@vercel/blob";
import { auth } from "@clerk/nextjs";

export interface VoiceRecording {
  id: string;
  userId: string;
  url: string;
  transcript?: string;
  duration: number;
  createdAt: Date;
  languageDialect?: string;
  feedback?: {
    pronunciation: string;
    grammar: string;
    fluency: string;
    vocabulary: string;
  };
}

export async function uploadVoiceRecording(
  audioBlob: Blob,
  userId: string,
  duration: number,
  languageDialect?: string
): Promise<VoiceRecording> {
  try {
    // Generate a unique filename with timestamp and user ID
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `voice-recordings/${userId}/${timestamp}.webm`;

    // Upload to Vercel Blob
    const { url, pathname } = await put(filename, audioBlob, {
      access: "public",
      addRandomSuffix: false, // We already have a unique timestamp
    });

    // Create recording metadata
    const recording: VoiceRecording = {
      id: pathname,
      userId,
      url,
      duration,
      createdAt: new Date(),
      languageDialect,
    };

    return recording;
  } catch (error) {
    console.error("Error uploading voice recording:", error);
    throw new Error("Failed to upload voice recording");
  }
}

export async function deleteVoiceRecording(recordingId: string): Promise<void> {
  try {
    // Verify user owns the recording (path includes userId)
    const { userId } = auth();
    if (!userId || !recordingId.includes(userId)) {
      throw new Error("Unauthorized");
    }

    await del(recordingId);
  } catch (error) {
    console.error("Error deleting voice recording:", error);
    throw new Error("Failed to delete voice recording");
  }
}

export async function listVoiceRecordings(
  userId: string
): Promise<VoiceRecording[]> {
  try {
    // List all recordings in the user's directory
    const { blobs } = await list({
      prefix: `voice-recordings/${userId}/`,
    });

    // Convert blobs to VoiceRecording objects
    const recordings: VoiceRecording[] = blobs.map((blob) => ({
      id: blob.pathname,
      userId,
      url: blob.url,
      duration: 0, // This would need to be stored separately in a database
      createdAt: blob.uploadedAt,
    }));

    return recordings.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  } catch (error) {
    console.error("Error listing voice recordings:", error);
    throw new Error("Failed to list voice recordings");
  }
}
