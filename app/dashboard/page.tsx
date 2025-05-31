import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { VoiceTimeline } from "@/components/voice-journal/timeline";
import { ProgressTracker } from "@/components/voice-journal/progress-tracker";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user's recordings with feedback
  const rawRecordings = await prisma.voiceRecording.findMany({
    where: { userId },
    include: { feedback: true },
    orderBy: { createdAt: "desc" },
  });

  // Transform the data to match our component types
  const recordings = rawRecordings.map((recording) => ({
    id: recording.id,
    blobUrl: recording.blobUrl,
    transcript: recording.transcript || undefined,
    duration: recording.duration,
    languageDialect: recording.languageDialect || undefined,
    createdAt: recording.createdAt,
    feedback: recording.feedback
      ? {
          pronunciation: recording.feedback.pronunciation,
          grammar: recording.feedback.grammar,
          fluency: recording.feedback.fluency,
          vocabulary: recording.feedback.vocabulary,
        }
      : undefined,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Voice Journal Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <VoiceTimeline recordings={recordings} />
        </div>

        <div className="md:col-span-2">
          <ProgressTracker recordings={recordings} />
        </div>
      </div>
    </div>
  );
}
