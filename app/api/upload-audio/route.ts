import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Write file to uploads directory
    await writeFile(join(uploadDir, filename), buffer);

    // Return the public URL
    const audioUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || ""
    }/uploads/${filename}`;

    console.log("File uploaded successfully:", audioUrl);
    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
