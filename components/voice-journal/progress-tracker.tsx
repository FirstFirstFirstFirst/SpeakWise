import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VoiceRecordingWithFeedback {
  id: string;
  blobUrl: string;
  transcript?: string;
  duration: number;
  languageDialect?: string;
  createdAt: Date;
  feedback?: {
    pronunciation: string;
    grammar: string;
    fluency: string;
    vocabulary: string;
  };
}

interface ProgressTrackerProps {
  recordings: VoiceRecordingWithFeedback[];
}

// Function to calculate average scores from feedback text
const calculateScores = (feedback: string) => {
  // This is a simple scoring mechanism - you might want to implement
  // a more sophisticated one based on your actual feedback analysis
  const positiveWords = [
    "excellent",
    "good",
    "great",
    "well",
    "clear",
    "perfect",
    "impressive",
  ];
  const negativeWords = [
    "improve",
    "work",
    "practice",
    "difficult",
    "unclear",
    "error",
    "mistake",
  ];

  const text = feedback.toLowerCase();
  let score = 50; // Base score

  positiveWords.forEach((word) => {
    if (text.includes(word)) score += 10;
  });

  negativeWords.forEach((word) => {
    if (text.includes(word)) score -= 5;
  });

  return Math.min(Math.max(score, 0), 100); // Ensure score is between 0 and 100
};

export function ProgressTracker({ recordings }: ProgressTrackerProps) {
  // Process recordings to get progress data
  const processedData = recordings
    .filter((recording) => recording.feedback)
    .map((recording) => ({
      date: new Date(recording.createdAt).toLocaleDateString(),
      pronunciation: calculateScores(recording.feedback!.pronunciation),
      grammar: calculateScores(recording.feedback!.grammar),
      fluency: calculateScores(recording.feedback!.fluency),
      vocabulary: calculateScores(recording.feedback!.vocabulary),
    }))
    .reverse(); // Show oldest to newest

  const chartData = {
    labels: processedData.map((data) => data.date),
    datasets: [
      {
        label: "Pronunciation",
        data: processedData.map((data) => data.pronunciation),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Grammar",
        data: processedData.map((data) => data.grammar),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Fluency",
        data: processedData.map((data) => data.fluency),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Vocabulary",
        data: processedData.map((data) => data.vocabulary),
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  // Calculate overall stats
  const latestRecording = processedData[processedData.length - 1];
  const firstRecording = processedData[0];

  const calculateImprovement = (latest: number, first: number) => {
    return latest - first;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Speaking Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {processedData.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No progress data available yet. Complete more recordings to see your
            progress!
          </div>
        ) : (
          <>
            <div className="h-[300px] mb-6">
              <Line options={options} data={chartData} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latestRecording && firstRecording && (
                <>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Pronunciation</p>
                    <p className="text-2xl font-bold">
                      {Math.round(latestRecording.pronunciation)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {calculateImprovement(
                        latestRecording.pronunciation,
                        firstRecording.pronunciation
                      )}
                      % change
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Grammar</p>
                    <p className="text-2xl font-bold">
                      {Math.round(latestRecording.grammar)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {calculateImprovement(
                        latestRecording.grammar,
                        firstRecording.grammar
                      )}
                      % change
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Fluency</p>
                    <p className="text-2xl font-bold">
                      {Math.round(latestRecording.fluency)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {calculateImprovement(
                        latestRecording.fluency,
                        firstRecording.fluency
                      )}
                      % change
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Vocabulary</p>
                    <p className="text-2xl font-bold">
                      {Math.round(latestRecording.vocabulary)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {calculateImprovement(
                        latestRecording.vocabulary,
                        firstRecording.vocabulary
                      )}
                      % change
                    </p>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
