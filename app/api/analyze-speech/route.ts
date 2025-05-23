// app/api/analyze-speech/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { LanguageDialectType } from "@/types/user";
import { generateAnalysisPrompt, getDialectPrompt, DialectPromptConfig } from "@/utils/lm-dialect-prompts";
import { getProfileById, LanguageDialectProfile } from "@/utils/lm-language-dialect-profiles";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Define the expected feedback structure
interface FeedbackResponse {
  pronunciation: string;
  grammar: string;
  fluency: string;
  vocabulary: string;
  languageDialectSpecificFeedback?: string[];
}

export async function POST(request: Request) {
  try {
    const { transcript, userId, userEmail, languageDialect } = await request.json();

    if (
      !transcript ||
      typeof transcript !== "string" ||
      transcript.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Valid transcript is required" },
        { status: 400 }
      );
    }

    // Use provided language/dialect or default to general
    const selectedDialect: LanguageDialectType = languageDialect || 'general';
    
    // Generate language/dialect-specific prompt
    const prompt = generateAnalysisPrompt(transcript, selectedDialect);
    
    // Get dialect-specific configuration for additional processing
    const dialectConfig = getDialectPrompt(selectedDialect);
    const profile = getProfileById(selectedDialect);

    console.log(`Analyzing speech for user ${userId} (${userEmail}) with ${profile?.name || 'General'} profile`);

    // Get the generative model (using a more capable model if needed)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2, // Lower temperature for more consistent results
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // Generate content with safety settings
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    let feedbackObject: FeedbackResponse;

    try {
      // Try to parse the response as JSON
      feedbackObject = JSON.parse(response);

      // Validate that all required fields are present
      const requiredFields = [
        "pronunciation",
        "grammar",
        "fluency",
        "vocabulary",
      ];
      const missingFields = requiredFields.filter(
        (field) => !feedbackObject[field as keyof FeedbackResponse]
      );

      if (missingFields.length > 0) {
        console.warn(
          `Missing fields in Gemini response: ${missingFields.join(", ")}`
        );
        // Handle missing fields by providing default messages
        missingFields.forEach((field) => {
          if (field !== 'languageDialectSpecificFeedback') {
            feedbackObject[
              field as keyof Omit<FeedbackResponse, 'languageDialectSpecificFeedback'>
            ] = `No specific ${field} feedback available. Please try again with a longer speech sample.`;
          }
        });
      }

      // Add language/dialect-specific feedback
      if (selectedDialect !== 'general' && profile) {
        feedbackObject.languageDialectSpecificFeedback = generateDialectSpecificTips(
          selectedDialect,
          dialectConfig,
          profile
        );
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
      console.log("Raw response:", response);

      // Extract potential JSON from the response if possible
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          feedbackObject = JSON.parse(jsonMatch[0]);
        } catch (e: unknown) {
          console.log("Unknown error", e);
          // If that fails too, use fallback
          feedbackObject = getFallbackFeedback();
        }
      } else {
        // Use fallback feedback
        feedbackObject = getFallbackFeedback();
      }
    }

    // Ensure all feedback entries are strings and have reasonable content
    const validatedFeedback: FeedbackResponse = {
      pronunciation: ensureValidFeedback(
        feedbackObject.pronunciation,
        "pronunciation"
      ),
      grammar: ensureValidFeedback(feedbackObject.grammar, "grammar"),
      fluency: ensureValidFeedback(feedbackObject.fluency, "fluency"),
      vocabulary: ensureValidFeedback(feedbackObject.vocabulary, "vocabulary"),
      languageDialectSpecificFeedback: feedbackObject.languageDialectSpecificFeedback,
    };

    // Log analysis for monitoring (remove in production)
    console.log(`Speech analysis completed for ${profile?.name || 'General'} speaker`);

    return NextResponse.json(validatedFeedback);
  } catch (error) {
    console.error("Error analyzing speech:", error);
    return NextResponse.json(getFallbackFeedback(), { status: 500 });
  }
}

// Ensure feedback is a valid string with reasonable content
function ensureValidFeedback(feedback: unknown, type: string): string {
  if (
    typeof feedback !== "string" ||
    feedback.trim().length < 10 ||
    feedback === "undefined" ||
    feedback === "null"
  ) {
    return `We couldn't generate specific ${type} feedback. Please try again with a clearer or longer speech sample.`;
  }
  return feedback;
}

// Generate dialect-specific tips based on the language profile
function generateDialectSpecificTips(
  languageDialect: LanguageDialectType,
  dialectConfig: DialectPromptConfig,
  profile: LanguageDialectProfile
): string[] {
  const tips: string[] = [];
  
  // Add tonal system tips if applicable
  if (profile.tonalSystem?.hasTones) {
    tips.push(
      `Remember that English uses stress patterns, not tones like ${profile.name}. Focus on emphasizing important words rather than using tonal variations.`
    );
  }
  
  // Add specific pronunciation tips
  if (dialectConfig.pronunciationFocus.length > 0) {
    tips.push(
      `Key pronunciation focus for ${profile.name} speakers: ${dialectConfig.pronunciationFocus.slice(0, 2).join(' and ')}.`
    );
  }
  
  // Add cultural context tip
  if (dialectConfig.culturalContext) {
    tips.push(
      `Cultural insight: ${dialectConfig.culturalContext.split('.')[0]}.`
    );
  }
  
  return tips;
}

// Fallback feedback to use when API fails
function getFallbackFeedback(): FeedbackResponse {
  return {
    pronunciation:
      "We couldn't analyze your pronunciation in detail. Try speaking clearly and at a moderate pace for better analysis.",
    grammar:
      "We couldn't analyze your grammatical structure in detail. Try providing a longer speech sample for more specific feedback.",
    fluency:
      "We couldn't evaluate your speech fluency in detail. Consider recording a longer sample with natural conversation.",
    vocabulary:
      "We couldn't assess your vocabulary usage in detail. Try speaking on a topic that allows you to demonstrate a range of vocabulary.",
  };
}
