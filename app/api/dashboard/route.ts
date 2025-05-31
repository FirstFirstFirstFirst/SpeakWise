import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import {
  DashboardResponse,
  AverageScores,
  VoiceRecording,
  VoiceRecordingFeedback,
  ChartDataPoint,
} from "@/types/user";

const prisma = new PrismaClient();

export async function GET(): Promise<
  NextResponse<DashboardResponse | { error: string }>
> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's voice recordings with feedback
    const recordings = await prisma.voiceRecording.findMany({
      where: {
        userId,
        duration: { gt: 0 },
      },
      include: {
        feedback: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate total practice time (in hours)
    const totalPracticeTime = recordings.reduce((total: number, recording) => {
      // Remove VoiceRecording type
      return total + recording.duration;
    }, 0);

    // Calculate average scores from feedback
    const averageScores: AverageScores = {
      pronunciation: 0,
      grammar: 0,
      fluency: 0,
      vocabulary: 0,
    };

    const recordingsWithFeedback = recordings.filter(
      (r): r is VoiceRecording & { feedback: VoiceRecordingFeedback } =>
        r.feedback !== null
    );

    if (recordingsWithFeedback.length > 0) {
      // Extract numeric scores from feedback text (basic implementation)
      recordingsWithFeedback.forEach((recording) => {
        const feedback = recording.feedback;

        // Basic scoring based on feedback content (you can make this more sophisticated)
        averageScores.pronunciation += extractScore(feedback.pronunciation);
        averageScores.grammar += extractScore(feedback.grammar);
        averageScores.fluency += extractScore(feedback.fluency);
        averageScores.vocabulary += extractScore(feedback.vocabulary);
      });

      // Calculate averages
      const count = recordingsWithFeedback.length;
      averageScores.pronunciation = Math.round(
        averageScores.pronunciation / count
      );
      averageScores.grammar = Math.round(averageScores.grammar / count);
      averageScores.fluency = Math.round(averageScores.fluency / count);
      averageScores.vocabulary = Math.round(averageScores.vocabulary / count);
    }

    // Calculate improvement rate (compare first vs last recording)
    let improvementRate = 0;
    if (recordingsWithFeedback.length >= 2) {
      const firstRecording =
        recordingsWithFeedback[recordingsWithFeedback.length - 1];
      const lastRecording = recordingsWithFeedback[0];

      const firstAvg = calculateOverallScore(firstRecording.feedback);
      const lastAvg = calculateOverallScore(lastRecording.feedback);

      if (firstAvg > 0) {
        improvementRate = Math.round(((lastAvg - firstAvg) / firstAvg) * 100);
      }
    }

    // Generate chart data for the last 10 recordings
    const chartData: ChartDataPoint[] = recordingsWithFeedback
      .slice(0, 10)
      .reverse()
      .map((recording, index) => ({
        session: index + 1,
        pronunciation: extractScore(recording.feedback.pronunciation),
        grammar: extractScore(recording.feedback.grammar),
        fluency: extractScore(recording.feedback.fluency),
        vocabulary: extractScore(recording.feedback.vocabulary),
        date: recording.createdAt.toISOString().split("T")[0],
      }));

    const response: DashboardResponse = {
      totalSessions: recordings.length,
      totalPracticeTime: Math.round((totalPracticeTime / 3600) * 10) / 10, // Convert to hours
      averageScores,
      improvementRate:
        improvementRate > 0 ? `+${improvementRate}%` : `${improvementRate}%`,
      chartData,
      hasData: recordings.length > 0,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// Helper function to extract score from feedback text
function extractScore(feedbackText: string): number {
  // Look for percentage patterns
  const percentageMatch = feedbackText.match(/(\d+)%/);
  if (percentageMatch) {
    return parseInt(percentageMatch[1], 10);
  }

  // Look for score patterns like "8/10" or "7 out of 10"
  const scoreMatch = feedbackText.match(/(\d+)(?:\/10|out of 10)/i);
  if (scoreMatch) {
    return parseInt(scoreMatch[1], 10) * 10;
  }

  // Basic sentiment analysis for keywords
  const text = feedbackText.toLowerCase();

  if (
    text.includes("excellent") ||
    text.includes("outstanding") ||
    text.includes("perfect")
  ) {
    return 90;
  }
  if (
    text.includes("very good") ||
    text.includes("great") ||
    text.includes("strong")
  ) {
    return 85;
  }
  if (
    text.includes("good") ||
    text.includes("well") ||
    text.includes("clear")
  ) {
    return 75;
  }
  if (
    text.includes("fair") ||
    text.includes("adequate") ||
    text.includes("reasonable")
  ) {
    return 65;
  }
  if (text.includes("needs improvement") || text.includes("could be better")) {
    return 55;
  }
  if (
    text.includes("poor") ||
    text.includes("difficult") ||
    text.includes("unclear")
  ) {
    return 45;
  }

  // Default score if no indicators found
  return 70;
}

// Helper function to calculate overall score from feedback
function calculateOverallScore(feedback: VoiceRecordingFeedback): number {
  const pronunciation = extractScore(feedback.pronunciation);
  const grammar = extractScore(feedback.grammar);
  const fluency = extractScore(feedback.fluency);
  const vocabulary = extractScore(feedback.vocabulary);

  return (pronunciation + grammar + fluency + vocabulary) / 4;
}
