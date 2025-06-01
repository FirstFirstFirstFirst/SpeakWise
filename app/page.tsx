"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Mic, StopCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useUserLanguageDialect } from "@/hooks/use-user-langauge-dialect";

export default function RecordPage() {
  const { user } = useUser();
  const { languageDialect: userLanguageDialect } = useUserLanguageDialect();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0); // Add this state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Recording timer states
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordedDurationRef = useRef<number>(0);
  const MAX_RECORDING_TIME = 5 * 60; // 5 minutes in seconds

  const [currentPrompt, setCurrentPrompt] = useState("");
  const prompts = [
    "Tell me about what you did yesterday. What was the most interesting part of your day?",
    "Describe your favorite meal. What ingredients does it contain and why do you enjoy it so much?",
    "What kind of food is popular in your country? Has this changed in recent years?",
    "Do you prefer eating at home or in restaurants? Why?",
    "Tell me about a traditional dish from your hometown. How is it prepared?",
    "Describe your morning routine. Has it changed much over the past few years?",
    "What changes have you seen in your hometown over the last few years?",
    "Do you think it's important to maintain a work-life balance? How do you achieve this?",
    "What types of outdoor activities do you enjoy? How often do you participate in them?",
    "Describe a skill you would like to learn. Why is this skill important to you?",
  ];

  // Function to select a random prompt
  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  };

  // Set initial prompt
  useState(() => {
    setCurrentPrompt(getRandomPrompt());
  });

  // Function to change the prompt
  const changePrompt = () => {
    setCurrentPrompt(getRandomPrompt());
  };

  // Function to get audio duration
  const getAudioDuration = (file: Blob): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);

      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve(0);
      }, 5000);

      audio.addEventListener("loadedmetadata", () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        const duration = audio.duration;
        resolve(isNaN(duration) ? 0 : Math.floor(duration));
      });

      audio.addEventListener("error", () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        resolve(0);
      });

      // Load the audio
      audio.preload = "metadata";
      audio.src = url;
      audio.load(); // Force load
    });
  };

  // Timer function to track recording duration
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime >= MAX_RECORDING_TIME) {
            stopRecording();
            return 0; // Reset on max time
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingTime(0); // Reset when not recording
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Try different MIME types for better compatibility
      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/wav",
      ];

      let mimeType = "audio/wav"; // fallback
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        const duration = recordedDurationRef.current;
        console.log("Duration from ref:", duration); // Debug log

        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setAudioDuration(duration);
        stopMediaTracks(stream);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error(
        "Could not access your microphone. Please check permissions."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Capture the duration RIGHT NOW before anything else happens
      recordedDurationRef.current = recordingTime;
      console.log("Duration captured in stopRecording:", recordingTime); // Debug log

      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const stopMediaTracks = (stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      const url = URL.createObjectURL(file);

      // Try to get duration, but don't fail if we can't
      let duration = 0;
      try {
        duration = await getAudioDuration(file);
      } catch (error) {
        console.warn("Could not get audio duration:", error);
        // Duration will remain 0, which is fine
      }

      setAudioBlob(file);
      setAudioUrl(url);
      setAudioDuration(duration);
    } else if (file) {
      toast.error("Please upload an audio file");
    }
  };

  const analyzeAudio = async () => {
    const loadingToastId = toast.loading("Your speech is being analyzed...");
    if (!audioBlob) {
      toast.error("Please record or upload audio first");
      return;
    }

    try {
      console.log("Duration", audioDuration.toString());
      // Convert blob to File object
      const audioFile = new File([audioBlob], "recording.wav", {
        type: "audio/wav",
      });

      // Create FormData to upload the file
      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("duration", audioDuration.toString());
      formData.append("languageDialect", userLanguageDialect);

      // Upload the file using voice-recordings endpoint
      const uploadResponse = await fetch("/api/voice-recordings", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload audio file");
      }

      const recording = await uploadResponse.json();
      console.log("Recording created:", recording); // Debug log

      // Send the URL to AssemblyAI for transcription
      const transcriptResponse = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audioUrl: recording.blobUrl,
          recordingId: recording.id, // Pass recordingId to transcribe
          userId: user?.id,
          userEmail: user?.emailAddresses[0]?.emailAddress,
        }),
      });

      if (!transcriptResponse.ok) {
        throw new Error("Transcription failed");
      }

      const { transcript, duration } = await transcriptResponse.json();

      // Validate transcript before storing
      if (!transcript || transcript.trim().length === 0) {
        throw new Error(
          "No transcript generated - please try recording again with clearer speech"
        );
      }

      // Store transcription data in localStorage for analysis page
      localStorage.setItem("speechTranscript", transcript);
      localStorage.setItem("speechDuration", duration.toString());
      localStorage.setItem("userId", user!.id);
      localStorage.setItem("languageDialect", userLanguageDialect);
      localStorage.setItem("recordingId", recording.id); // Store recordingId

      console.log("Stored in localStorage:", {
        transcript: transcript.substring(0, 100) + "...",
        duration,
        userId: user!.id,
        languageDialect: userLanguageDialect,
        recordingId: recording.id,
      });

      toast.dismiss(loadingToastId);
      toast.success("Analysis Complete!");

      // Navigate to analysis page
      router.push("/analysis");
    } catch (error) {
      console.error("Error analyzing audio:", error);
      toast.dismiss(loadingToastId);
      toast.error(
        `Error analyzing speech: ${
          error instanceof Error ? error.message : "Please try again."
        }`
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10 space-y-6 sm:space-y-8 max-w-4xl">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          {user
            ? `Welcome back, ${
                user.firstName ||
                user.emailAddresses[0]?.emailAddress.split("@")[0]
              }!`
            : "Unlock Your English Speaking Potential!"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {user
            ? "Continue your English learning journey with personalized feedback"
            : "Record your voice and get instant feedback to improve your English"}
        </p>
      </div>
      {/* Practice Text Card - Added component */}
      <Card className="shadow-md">
        <CardHeader className="text-center py-4">
          <CardTitle className="text-xl flex items-center justify-center">
            <span>Speaking Practice Question</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={changePrompt}
              title="Get a new question"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <p className="text-base">{currentPrompt}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="text-center py-4 sm:py-6">
          <CardTitle className="text-xl sm:text-2xl">
            Record Your Voice{" "}
            {isRecording && (
              <span className="text-sm font-normal ml-2 text-red-500">
                Recording: {formatTime(recordingTime)} / 5:00
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 sm:space-y-6 p-4 sm:p-6">
          {audioUrl ? (
            <div className="w-full">
              <audio className="w-full" src={audioUrl} controls />
              {audioDuration > 0 && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Duration: {formatTime(audioDuration)}
                </p>
              )}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed rounded-lg border-muted-foreground/25 bg-muted/50 cursor-pointer"
              onClick={!isRecording ? handleUploadClick : undefined}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                  <div
                    className="p-2 sm:p-3 rounded-full bg-primary/10 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadClick();
                    }}
                  >
                    <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div
                    className="p-2 sm:p-3 rounded-full bg-primary/10 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isRecording) {
                        startRecording();
                      }
                    }}
                  >
                    <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Upload audio or Start recording (5 minute limit)
                </p>
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />

          {!audioUrl ? (
            <Button
              size="lg"
              className="rounded-full px-6 sm:px-8 w-full sm:w-auto bg-black text-white cursor-pointer"
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <>
                  <StopCircle className="mr-2 h-4 w-4" /> Stop Recording
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  <p>Start Recording</p>
                </>
              )}
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-6 sm:px-8"
                onClick={() => {
                  setAudioUrl(null);
                  setAudioBlob(null);
                  setAudioDuration(0); // Reset duration
                }}
              >
                Record Again
              </Button>
              <Button
                size="lg"
                className="rounded-full px-6 sm:px-8 bg-black text-white"
                onClick={analyzeAudio}
              >
                Analyze Speech
              </Button>
            </div>
          )}

          <div className="text-xs sm:text-sm text-center text-muted-foreground">
            <p>Speak clearly and at a natural pace for best results</p>
            <p>Maximum recording time: 5 minutes</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="text-center py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="p-3 sm:p-4 space-y-1 sm:space-y-2">
              <div className="mx-auto rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 flex items-center justify-center">
                <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <h3 className="font-medium text-sm sm:text-base">Record</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Record your voice speaking English
              </p>
            </div>
            <div className="p-3 sm:p-4 space-y-1 sm:space-y-2">
              <div className="mx-auto rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary sm:w-5 sm:h-5"
                >
                  <path d="M2 12h10" />
                  <path d="M9 4v16" />
                  <path d="M3 9v6" />
                  <path d="M14 4v16" />
                  <path d="M14 12h8" />
                  <path d="M22 9v6" />
                </svg>
              </div>
              <h3 className="font-medium text-sm sm:text-base">Analyze</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Get detailed AI analysis of your speech
              </p>
            </div>
            <div className="p-3 sm:p-4 space-y-1 sm:space-y-2 sm:col-span-2 md:col-span-1">
              <div className="mx-auto rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary sm:w-5 sm:h-5"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="font-medium text-sm sm:text-base">Improve</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Track your progress over time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
