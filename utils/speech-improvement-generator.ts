export interface FeedbackResponse {
  pronunciation: string;
  grammar: string;
  fluency: string;
  vocabulary: string;
}

export interface ImprovementSuggestion {
  title: string;
  description: string;
}
export function generateImprovementSuggestions(
  feedback: FeedbackResponse
): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];

  // Extract pronunciation suggestions
  if (feedback.pronunciation) {
    // Look for specific sounds mentioned in the pronunciation feedback
    const soundMatches = feedback.pronunciation.match(
      /['"]\w+['"]|'\w+'|"\w+"|sound\s+['"]?\w+['"]?|sounds\s+['"]?\w+['"]?|phoneme\s+['"]?\w+['"]?|phonemes\s+['"]?\w+['"]?|difficulty with ['"]?[a-zA-Z\s-]+['"]?/gi
    );

    if (soundMatches && soundMatches.length > 0) {
      // Create a suggestion based on the first mentioned sound
      const soundExample = soundMatches[0]
        .replace(/['"]/g, "")
        .replace(/sound\s+/i, "")
        .replace(/sounds\s+/i, "")
        .replace(/phoneme\s+/i, "")
        .replace(/phonemes\s+/i, "")
        .replace(/difficulty with /i, "")
        .trim();

      // Check if it's a common English sound pattern
      const commonSounds = {
        th: "think, through, three, thanks, the, this",
        r: "red, run, around, partner, very",
        l: "light, love, hello, totally, still",
        v: "very, love, have, vivid, five",
        w: "water, away, always, wonderful",
        ng: "singing, bringing, ringing, hanging",
        "short i": "sit, tip, fill, win, in",
        "long e": "see, bee, key, meet, need",
        schwa: "about, separate, cinema, melody",
        er: "work, further, certain, nurse",
        sh: "ship, wish, sure, station",
        ch: "church, match, feature",
        j: "job, gem, danger",
        z: "zero, noise, goes, rise",
      };

      // Find which common sound pattern contains our matched sound
      let matchedSound = "";
      let exampleWords = "";

      for (const [sound, examples] of Object.entries(commonSounds)) {
        if (
          soundExample.toLowerCase().includes(sound) ||
          sound.includes(soundExample.toLowerCase())
        ) {
          matchedSound = sound;
          exampleWords = examples;
          break;
        }
      }

      // If we didn't find a match in our dictionary, use a generic one
      if (!matchedSound) {
        matchedSound = soundExample;
        exampleWords = "practice with different words containing this sound";
      }

      suggestions.push({
        title: `Practice '${matchedSound}' Sound`,
        description: `Try these words: ${exampleWords}`,
      });
    } else {
      // Generic pronunciation suggestion if no specific sound was identified
      suggestions.push({
        title: "Daily Pronunciation Drills",
        description:
          "Record yourself reading aloud and compare with native speakers",
      });
    }
  }

  // Extract grammar suggestions
  if (feedback.grammar) {
    // Look for specific grammar issues
    const grammarMatches = feedback.grammar.match(
      /preposition|tense|plural|singular|article|conjunction|incorrect|instead of|should be|verb form|missing|unnecessary/gi
    );

    if (grammarMatches && grammarMatches.length > 0) {
      // Identify the grammar issue type
      const grammarIssue = grammarMatches[0].toLowerCase();

      if (grammarIssue.includes("preposition")) {
        suggestions.push({
          title: "Preposition Usage",
          description:
            "Review time prepositions: for, since, during, in, at, on",
        });
      } else if (grammarIssue.includes("tense")) {
        suggestions.push({
          title: "Verb Tense Practice",
          description:
            "Focus on consistency between past, present and future tenses",
        });
      } else if (grammarIssue.includes("article")) {
        suggestions.push({
          title: "Article Usage (a/an/the)",
          description:
            "Study when to use definite vs indefinite articles or no article",
        });
      } else if (
        grammarIssue.includes("plural") ||
        grammarIssue.includes("singular")
      ) {
        suggestions.push({
          title: "Singular/Plural Agreement",
          description:
            "Practice subject-verb agreement with both regular and irregular plurals",
        });
      } else {
        suggestions.push({
          title: "Grammar Structure Review",
          description:
            "Use a grammar checker tool and study the suggested corrections",
        });
      }
    } else {
      // Generic grammar suggestion
      suggestions.push({
        title: "Basic Grammar Exercises",
        description:
          "Complete daily sentence structure exercises focusing on common patterns",
      });
    }
  }

  // Extract fluency suggestions
  if (feedback.fluency) {
    const fluencyMatches = feedback.fluency.match(
      /pause|hesitation|rhythm|speed|pace|slow|fast|flow|fluent|natural|confident/gi
    );

    if (fluencyMatches && fluencyMatches.length > 0) {
      const fluencyIssue = fluencyMatches[0].toLowerCase();

      if (
        fluencyIssue.includes("pause") ||
        fluencyIssue.includes("hesitation")
      ) {
        suggestions.push({
          title: "Fluency Exercise",
          description:
            "Read aloud for 5 minutes daily without stopping, even if you make mistakes",
        });
      } else if (
        fluencyIssue.includes("rhythm") ||
        fluencyIssue.includes("flow")
      ) {
        suggestions.push({
          title: "Rhythm & Intonation",
          description:
            "Shadow speak along with podcast hosts or audiobooks to match their rhythm",
        });
      } else if (fluencyIssue.includes("slow")) {
        suggestions.push({
          title: "Speaking Speed Practice",
          description:
            "Try tongue twisters at increasing speeds to improve articulation",
        });
      } else if (fluencyIssue.includes("fast")) {
        suggestions.push({
          title: "Clarity Exercise",
          description:
            "Practice speaking slightly slower while emphasizing important words",
        });
      } else {
        suggestions.push({
          title: "Natural Speech Flow",
          description:
            "Record yourself telling a story and focus on smooth transitions between ideas",
        });
      }
    } else {
      // Generic fluency suggestion
      suggestions.push({
        title: "Conversation Practice",
        description:
          "Have regular 10-minute conversations with language partners or AI chat tools",
      });
    }
  }

  // Limit to 3 suggestions maximum
  return suggestions.slice(0, 3);
}
