"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Play, Pause, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

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

interface VoiceTimelineProps {
  recordings: VoiceRecordingWithFeedback[];
}

export function VoiceTimeline({ recordings }: VoiceTimelineProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<{ [key: string]: number }>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Initialize audio elements for each recording
  useEffect(() => {
    recordings.forEach((recording) => {
      if (!audioRefs.current[recording.id]) {
        const audio = new Audio(recording.blobUrl);
        audio.preload = "metadata";

        // Add event listeners
        audio.addEventListener("timeupdate", () => {
          setCurrentTime((prev) => ({
            ...prev,
            [recording.id]: audio.currentTime,
          }));
        });

        audio.addEventListener("ended", () => {
          setPlayingId(null);
          setCurrentTime((prev) => ({
            ...prev,
            [recording.id]: 0,
          }));
        });

        audio.addEventListener("error", (e) => {
          console.error("Audio error for recording", recording.id, e);
          setPlayingId(null);
        });

        audioRefs.current[recording.id] = audio;
      }
    });

    // Cleanup function
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.removeEventListener("timeupdate", () => {});
        audio.removeEventListener("ended", () => {});
        audio.removeEventListener("error", () => {});
      });
    };
  }, [recordings]);

  const togglePlay = async (recordingId: string) => {
    setLoadingId(recordingId);

    const audio = audioRefs.current[recordingId];
    if (!audio) {
      setLoadingId(null);
      return;
    }

    if (playingId === recordingId) {
      // Pause current recording
      audio.pause();
      setPlayingId(null);
      setLoadingId(null);
    } else {
      // Stop any currently playing audio
      if (playingId) {
        const currentAudio = audioRefs.current[playingId];
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }

      // Play new recording
      try {
        // Make sure audio is loaded
        if (audio.readyState < 3) {
          await new Promise((resolve, reject) => {
            audio.addEventListener("canplay", resolve, { once: true });
            audio.addEventListener("error", reject, { once: true });
            audio.load();
          });
        }

        await audio.play();
        setPlayingId(recordingId);
      } catch (error) {
        console.error("Error playing audio:", error);
        setPlayingId(null);
      } finally {
        setLoadingId(null);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Recording Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recordings.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No recordings yet. Start by recording your voice!
            </div>
          ) : (
            recordings.map((recording) => (
              <div
                key={recording.id}
                className="flex flex-col space-y-3 p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => togglePlay(recording.id)}
                      disabled={
                        !audioRefs.current[recording.id] ||
                        loadingId === recording.id
                      }
                    >
                      {loadingId === recording.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : playingId === recording.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <p className="font-medium">
                        {recording.languageDialect || "General Practice"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(recording.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center space-x-2">
                    {playingId === recording.id && (
                      <span>
                        {formatTime(currentTime[recording.id] || 0)} /
                      </span>
                    )}
                    <span>{formatTime(recording.duration)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                {playingId === recording.id && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-100"
                      style={{
                        width: `${
                          ((currentTime[recording.id] || 0) /
                            recording.duration) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                )}

                {recording.transcript && (
                  <p className="text-sm text-muted-foreground">
                    {recording.transcript}
                  </p>
                )}

                {recording.feedback && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">Pronunciation</p>
                      <p className="text-sm text-muted-foreground">
                        {recording.feedback.pronunciation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Grammar</p>
                      <p className="text-sm text-muted-foreground">
                        {recording.feedback.grammar}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fluency</p>
                      <p className="text-sm text-muted-foreground">
                        {recording.feedback.fluency}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vocabulary</p>
                      <p className="text-sm text-muted-foreground">
                        {recording.feedback.vocabulary}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
