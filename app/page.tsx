import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Mic } from "lucide-react";

export default function RecordPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-10 space-y-6 sm:space-y-8 max-w-4xl">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          Unlock Your English Speaking Potential!
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Record your voice and get instant feedback to improve your English
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="text-center py-4 sm:py-6">
          <CardTitle className="text-xl sm:text-2xl">
            Record Your Voice
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 sm:space-y-6 p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed rounded-lg border-muted-foreground/25 bg-muted/50">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 rounded-full bg-primary/10">
                  <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="p-2 sm:p-3 rounded-full bg-primary/10">
                  <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Upload audio or Start recording
              </p>
            </div>
          </div>

          <Button
            size="lg"
            className="rounded-full px-6 sm:px-8 w-full sm:w-auto"
          >
            Start Recording
          </Button>

          <div className="text-xs sm:text-sm text-center text-muted-foreground">
            <p>Speak clearly and at a natural pace for best results</p>
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
