-- CreateTable
CREATE TABLE "voice_recordings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blobUrl" TEXT NOT NULL,
    "blobPathname" TEXT NOT NULL,
    "transcript" TEXT,
    "duration" INTEGER NOT NULL,
    "languageDialect" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voice_recordings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_recording_feedback" (
    "id" TEXT NOT NULL,
    "recordingId" TEXT NOT NULL,
    "pronunciation" TEXT NOT NULL,
    "grammar" TEXT NOT NULL,
    "fluency" TEXT NOT NULL,
    "vocabulary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voice_recording_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "voice_recordings_userId_idx" ON "voice_recordings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "voice_recording_feedback_recordingId_key" ON "voice_recording_feedback"("recordingId");

-- AddForeignKey
ALTER TABLE "voice_recording_feedback" ADD CONSTRAINT "voice_recording_feedback_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "voice_recordings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
