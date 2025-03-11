"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  generateImprovementSuggestions,
  ImprovementSuggestion,
} from "@/utils/speech-improvement-generator";
import Link from "next/link";

export default function AnalysisPage() {
  const [transcript, setTranscript] = useState("");
  const [duration, setDuration] = useState(0);
  const [feedback, setFeedback] = useState({
    pronunciation: "",
    grammar: "",
    fluency: "",
    vocabulary: "",
  });
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Retrieve transcript and duration from localStorage
    const savedTranscript = localStorage.getItem("speechTranscript") || "";
    const savedDuration = localStorage.getItem("speechDuration") || "0";

    setTranscript(savedTranscript);
    setDuration(parseInt(savedDuration, 10));

    // Analyze transcript using Gemini API
    if (savedTranscript) {
      analyzeSpeech(savedTranscript);
    }
  }, []);

  // Download transcript as PDF
  const downloadTranscriptAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Speech Transcript", 20, 20);
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(transcript, 170);
    doc.text(splitText, 20, 30);
    doc.setFontSize(10);
    doc.text(
      `Duration: ${duration} seconds | Generated: ${new Date().toLocaleDateString()}`,
      20,
      doc.internal.pageSize.height - 20
    );
    doc.save("speech-transcript.pdf");
  };

  // Download feedback as PDF
  const saveFeedbackAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("AI Speech Feedback", 20, 20);

    let yPosition = 30;
    doc.setFontSize(14);
    doc.text("Pronunciation", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    const pronText = doc.splitTextToSize(feedback.pronunciation, 170);
    doc.text(pronText, 20, yPosition);
    yPosition += pronText.length * 7;

    doc.setFontSize(14);
    doc.text("Grammar", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    const grammarText = doc.splitTextToSize(feedback.grammar, 170);
    doc.text(grammarText, 20, yPosition);
    yPosition += grammarText.length * 7;

    doc.setFontSize(14);
    doc.text("Fluency", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    const fluencyText = doc.splitTextToSize(feedback.fluency, 170);
    doc.text(fluencyText, 20, yPosition);
    yPosition += fluencyText.length * 7;

    doc.setFontSize(14);
    doc.text("Vocabulary", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    const vocabText = doc.splitTextToSize(feedback.vocabulary, 170);
    doc.text(vocabText, 20, yPosition);

    doc.setFontSize(10);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      20,
      doc.internal.pageSize.height - 20
    );
    doc.save("speech-feedback.pdf");
  };

  const analyzeSpeech = async (speechTranscript: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript: speechTranscript }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze speech");
      }

      const feedbackData = await response.json();
      setFeedback(feedbackData);

      const generatedSuggestions = generateImprovementSuggestions(feedbackData);

      setSuggestions(generatedSuggestions);
    } catch (error) {
      console.error("Error analyzing speech:", error);
      toast?.error("Failed to analyze speech. Please try again.");
      // Set fallback feedback
      setFeedback({
        pronunciation: "Analysis unavailable. Please try again.",
        grammar: "Analysis unavailable. Please try again.",
        fluency: "Analysis unavailable. Please try again.",
        vocabulary: "Analysis unavailable. Please try again.",
      });

      setSuggestions([
        {
          title: "Record Longer Samples",
          description:
            "Provide at least 30 seconds of speech for better analysis",
        },
        {
          title: "Speak Clearly",
          description:
            "Try to speak at a moderate pace with clear articulation",
        },
        {
          title: "Varied Content",
          description:
            "Discuss different topics to show range of vocabulary and grammar",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10 max-w-5xl space-y-4 sm:space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          Analysis Results
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Review your speech analysis and get personalized feedback
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="shadow-md h-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Speech-To-Text</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="bg-muted p-3 sm:p-4 rounded-lg h-[200px] sm:h-[250px] md:h-[300px] overflow-y-auto">
              <p className="text-xs sm:text-sm leading-relaxed">
                {transcript || "No transcript available."}
              </p>
            </div>
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="text-xs sm:text-sm text-muted-foreground">
                <span>Duration: {duration} seconds</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm w-full sm:w-auto cursor-pointer"
                onClick={downloadTranscriptAsPDF}
                disabled={!transcript}
              >
                Download Transcript
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md h-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">AI Feedback</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="bg-muted p-3 sm:p-4 rounded-lg h-[200px] sm:h-[250px] md:h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : transcript ? (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium">
                      Pronunciation
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {feedback.pronunciation}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium">Grammar</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {feedback.grammar}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium">Fluency</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {feedback.fluency}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium">
                      Vocabulary
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {feedback.vocabulary}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  No feedback available.
                </p>
              )}
            </div>
            <div className="mt-3 sm:mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm w-full sm:w-auto cursor-pointer"
                onClick={saveFeedbackAsPDF}
                disabled={!transcript || isLoading}
              >
                Save Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">
            Improvement Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-muted p-3 sm:p-4 rounded-lg">
                    <h3 className="text-xs sm:text-sm font-medium">
                      {suggestion.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    Record your speech to get personalized improvement
                    suggestions.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 sm:mt-6 flex justify-center">
            <Link href="/" className="block sm:inline-block ">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm w-full cursor-pointer"
              >
                Start New Practice Session
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
