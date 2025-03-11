import * as fs from "fs";
import * as path from "path";

export function cleanupUploadsDirectory(): void {
  const uploadDir: string = path.join(process.cwd(), "public", "uploads");
  if (fs.existsSync(uploadDir)) {
    const files: string[] = fs.readdirSync(uploadDir);
    files.forEach((file: string) => {
      fs.unlinkSync(path.join(uploadDir, file));
    });
  }
}
