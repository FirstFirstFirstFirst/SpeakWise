"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createChart, IChartApi, Time, LineSeries } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

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

// Audio player component for each recording
const AudioPlayer = ({
  blobUrl,
  duration,
}: {
  blobUrl: string;
  duration: number;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
      <audio ref={audioRef} src={blobUrl} preload="metadata" />
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </button>
      <Volume2 className="w-4 h-4 text-muted-foreground" />
      <div className="flex-1 text-sm text-muted-foreground">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

// Function to calculate average scores from feedback text
const calculateScores = (feedback: string) => {
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
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [selectedRecording, setSelectedRecording] =
    useState<VoiceRecordingWithFeedback | null>(null);

  // Process recordings to get progress data
  const processedData = recordings
    .filter((recording) => recording.feedback)
    .map((recording) => ({
      date: new Date(recording.createdAt).toLocaleDateString(),
      timestamp: Math.floor(new Date(recording.createdAt).getTime() / 1000), // Unix timestamp for chart
      pronunciation: calculateScores(recording.feedback!.pronunciation),
      grammar: calculateScores(recording.feedback!.grammar),
      fluency: calculateScores(recording.feedback!.fluency),
      vocabulary: calculateScores(recording.feedback!.vocabulary),
      recording,
    }))
    .sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp

  useEffect(() => {
    if (!chartContainerRef.current || processedData.length === 0) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: "transparent" },
        textColor: "#666",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      rightPriceScale: {
        borderColor: "#e1e1e1",
      },
      timeScale: {
        borderColor: "#e1e1e1",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add series for each skill
    const pronunciationSeries = chart.addSeries(LineSeries, {
      color: "#ef4444",
      lineWidth: 2,
      title: "Pronunciation",
    });

    const grammarSeries = chart.addSeries(LineSeries, {
      color: "#10b981",
      lineWidth: 2,
      title: "Grammar",
    });

    const fluencySeries = chart.addSeries(LineSeries, {
      color: "#3b82f6",
      lineWidth: 2,
      title: "Fluency",
    });

    const vocabularySeries = chart.addSeries(LineSeries, {
      color: "#f59e0b",
      lineWidth: 2,
      title: "Vocabulary",
    });

    // Handle clicks on data points
    chart.subscribeCrosshairMove((param) => {
      if (param && param.time) {
        const dataPoint = processedData.find(
          (data) => data.timestamp === (param.time as number)
        );
        if (dataPoint) {
          setSelectedRecording(dataPoint.recording);
        }
      }
    });

    // Set data for each series
    pronunciationSeries.setData(
      processedData.map((data) => ({
        time: data.timestamp as Time,
        value: data.pronunciation,
      }))
    );

    grammarSeries.setData(
      processedData.map((data) => ({
        time: data.timestamp as Time,
        value: data.grammar,
      }))
    );

    fluencySeries.setData(
      processedData.map((data) => ({
        time: data.timestamp as Time,
        value: data.fluency,
      }))
    );

    vocabularySeries.setData(
      processedData.map((data) => ({
        time: data.timestamp as Time,
        value: data.vocabulary,
      }))
    );

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [processedData]);

  // Calculate overall stats
  const latestRecording = processedData[processedData.length - 1];
  const firstRecording = processedData[0];

  const calculateImprovement = (latest: number, first: number) => {
    return latest - first;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Speaking Progress with Audio Playback
        </CardTitle>
      </CardHeader>
      <CardContent>
        {processedData.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No progress data available yet. Complete more recordings to see your
            progress!
          </div>
        ) : (
          <>
            {/* Chart Container */}
            <div
              ref={chartContainerRef}
              className="h-[300px] mb-6 border rounded-lg"
            />

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Pronunciation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Grammar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Fluency</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Vocabulary</span>
              </div>
            </div>

            {/* Selected Recording Audio Player */}
            {selectedRecording && (
              <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">
                  Recording from{" "}
                  {new Date(selectedRecording.createdAt).toLocaleDateString()}
                </h4>
                <AudioPlayer
                  blobUrl={selectedRecording.blobUrl}
                  duration={selectedRecording.duration}
                />
                {selectedRecording.transcript && (
                  <div className="mt-3 p-3 bg-background rounded text-sm">
                    <strong>Transcript:</strong> {selectedRecording.transcript}
                  </div>
                )}
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                      ) > 0
                        ? "+"
                        : ""}
                      {Math.round(
                        calculateImprovement(
                          latestRecording.pronunciation,
                          firstRecording.pronunciation
                        )
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
                      ) > 0
                        ? "+"
                        : ""}
                      {Math.round(
                        calculateImprovement(
                          latestRecording.grammar,
                          firstRecording.grammar
                        )
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
                      ) > 0
                        ? "+"
                        : ""}
                      {Math.round(
                        calculateImprovement(
                          latestRecording.fluency,
                          firstRecording.fluency
                        )
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
                      ) > 0
                        ? "+"
                        : ""}
                      {Math.round(
                        calculateImprovement(
                          latestRecording.vocabulary,
                          firstRecording.vocabulary
                        )
                      )}
                      % change
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Recent Recordings List */}
            <div>
              <h4 className="font-medium mb-3">Recent Recordings</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {recordings
                  .slice(-5)
                  .reverse()
                  .map((recording) => (
                    <div
                      key={recording.id}
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedRecording(recording)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {new Date(recording.createdAt).toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(recording.duration)}s
                        </span>
                      </div>
                      <AudioPlayer
                        blobUrl={recording.blobUrl}
                        duration={recording.duration}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
