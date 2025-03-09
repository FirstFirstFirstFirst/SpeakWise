import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AnalysisPage() {
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
                Hello, my name is Sarah and I&apos;m learning English. I&apos;ve
                been studying for about six months now. I find grammar to be
                quite challenging, especially the use of prepositions. Sometimes
                I struggle with pronunciation as well, particularly with the
                &apos;th&apos; sound. I enjoy watching English movies and
                listening to podcasts to improve my listening skills. I hope to
                become fluent in English within the next year so that I can
                apply for jobs at international companies.
              </p>
            </div>
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="text-xs sm:text-sm text-muted-foreground">
                <span>Duration: 45 seconds</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm w-full sm:w-auto"
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
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium">
                    Pronunciation
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Your pronunciation is generally clear, but you have some
                    difficulty with the &apos;th&apos; sound. Try placing your
                    tongue between your teeth and gently blowing air out.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium">Grammar</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    You used prepositions correctly in most cases, but there
                    were a few errors. For example, you said &quot;studying
                    for&quot; instead of &quot;studying since&quot; when
                    referring to time.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium">Fluency</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Your speech has a good pace, but there were several pauses
                    that interrupted the flow. Practice speaking continuously to
                    improve fluency.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium">Vocabulary</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    You used a good range of vocabulary. Consider expanding your
                    professional vocabulary if you&apos;re interested in working
                    at international companies.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex justify-end">
              <Button size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
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
              <div className="bg-muted p-3 sm:p-4 rounded-lg">
                <h3 className="text-xs sm:text-sm font-medium">
                  Practice &apos;th&apos; Sound
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Try these words: think, through, three, thanks, the, this
                </p>
              </div>
              <div className="bg-muted p-3 sm:p-4 rounded-lg">
                <h3 className="text-xs sm:text-sm font-medium">
                  Preposition Usage
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Review time prepositions: for, since, during, in, at, on
                </p>
              </div>
              <div className="bg-muted p-3 sm:p-4 rounded-lg">
                <h3 className="text-xs sm:text-sm font-medium">
                  Fluency Exercise
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Read aloud for 5 minutes daily without stopping
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 flex justify-center">
            <Button className="w-full sm:w-auto">Start Practice Session</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
