"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

  const togglePlay = (recordingId: string) => {
    if (playingId === recordingId) {
      // Stop playing
      setPlayingId(null);
    } else {
      // Start playing
      setPlayingId(recordingId);
    }
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
                    >
                      {playingId === recording.id ? (
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
                  <div className="text-sm text-muted-foreground">
                    {Math.round(recording.duration)}s
                  </div>
                </div>

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
