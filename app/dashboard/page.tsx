import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mic } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          Progress Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track your English speaking improvement over time
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl">Speaking Metrics</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-muted p-3 sm:p-4 rounded-lg text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                78%
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                Pronunciation
              </div>
            </div>
            <div className="bg-muted p-3 sm:p-4 rounded-lg text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                82%
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                Grammar
              </div>
            </div>
            <div className="bg-muted p-3 sm:p-4 rounded-lg text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                65%
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                Fluency
              </div>
            </div>
            <div className="bg-muted p-3 sm:p-4 rounded-lg text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                70%
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                Vocabulary
              </div>
            </div>
          </div>

          <div className="h-[150px] sm:h-[200px] w-full bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center px-2">
              <p className="text-sm text-muted-foreground">
                Performance Visualization
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Charts showing your speaking metrics over time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl">
            Progress Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <div className="h-[150px] sm:h-[200px] w-full bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center px-2">
              <p className="text-sm text-muted-foreground">
                Improvement Timeline
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Chart showing your progress over the last 30 days
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-muted p-3 sm:p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-xs sm:text-sm font-medium">
                  Total Sessions
                </div>
                <div className="text-primary font-bold text-sm sm:text-base">
                  24
                </div>
              </div>
            </div>
            <div className="bg-muted p-3 sm:p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-xs sm:text-sm font-medium">
                  Practice Time
                </div>
                <div className="text-primary font-bold text-sm sm:text-base">
                  12.5 hrs
                </div>
              </div>
            </div>
            <div className="bg-muted p-3 sm:p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-xs sm:text-sm font-medium">
                  Overall Improvement
                </div>
                <div className="text-primary font-bold text-sm sm:text-base">
                  +15%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl">Practice Chat</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <div className="bg-muted p-3 sm:p-4 rounded-lg h-[200px] sm:h-[250px] overflow-y-auto">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="rounded-full bg-primary/10 p-1.5 sm:p-2">
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                </div>
                <div className="bg-secondary p-2 sm:p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <p className="text-xs sm:text-sm">
                    Hello! I&apos;m your AI speaking partner. What would you
                    like to practice today?
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 justify-end">
                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg rounded-tr-none max-w-[80%]">
                  <p className="text-xs sm:text-sm">
                    I&apos;d like to practice talking about my hobbies and
                    interests.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="rounded-full bg-primary/10 p-1.5 sm:p-2">
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                </div>
                <div className="bg-secondary p-2 sm:p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <p className="text-xs sm:text-sm">
                    Great! Tell me about your favorite hobby. What do you enjoy
                    doing in your free time?
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full h-9 sm:h-10 rounded-full border border-input bg-background px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full"
            >
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
                className="lucide lucide-send"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
              <span className="sr-only">Send</span>
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full"
            >
              <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">Record</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
