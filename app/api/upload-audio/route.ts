import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

export const config = {
  runtime: "edge",
};

export async function POST(request: NextRequest) {
  try {
    console.log("upload audio being called");
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create unique filename
    const filename = `${uuidv4()}.wav`;

    // Upload file to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    console.log("File uploaded successfully to Vercel Blob:", blob.url);

    // Return the public URL provided by Vercel Blob
    return NextResponse.json({ audioUrl: blob.url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
