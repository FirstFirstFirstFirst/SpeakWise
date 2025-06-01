// app/api/analyze-speech/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { LanguageDialectType } from "@/types/user";
import {
  generateAnalysisPrompt,
  getDialectPrompt,
  DialectPromptConfig,
} from "@/utils/lm-dialect-prompts";
import {
  getProfileById,
  LanguageDialectProfile,
} from "@/utils/lm-language-dialect-profiles";
import { prisma } from "@/lib/prisma";

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
  const startTime = Date.now();
  console.log(
    `[SPEECH_ANALYSIS] Request started at ${new Date().toISOString()}`
  );

  try {
    const { transcript, userId, userEmail, languageDialect, recordingId } =
      await request.json();

    console.log(`[SPEECH_ANALYSIS] Request payload:`, {
      transcriptLength: transcript?.length || 0,
      userId,
      userEmail,
      languageDialect,
      recordingId, // Added recordingId logging
      transcriptPreview:
        transcript?.substring(0, 100) + (transcript?.length > 100 ? "..." : ""),
    });

    // Input validation
    if (
      !transcript ||
      typeof transcript !== "string" ||
      transcript.trim().length === 0
    ) {
      console.warn(`[SPEECH_ANALYSIS] Invalid transcript provided`, {
        userId,
        transcriptType: typeof transcript,
        transcriptLength: transcript?.length || 0,
      });
      return NextResponse.json(
        { error: "Valid transcript is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      console.warn(`[SPEECH_ANALYSIS] Missing userId`, { userEmail });
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate recordingId if provided (optional for backward compatibility)
    if (recordingId && typeof recordingId !== "string") {
      console.warn(`[SPEECH_ANALYSIS] Invalid recordingId provided`, {
        userId,
        recordingId,
        recordingIdType: typeof recordingId,
      });
      return NextResponse.json(
        { error: "Valid recording ID is required" },
        { status: 400 }
      );
    }

    // Determine the language dialect to use for analysis
    let selectedDialect: LanguageDialectType = "general";

    console.log(`[SPEECH_ANALYSIS] Determining dialect for user ${userId}`);

    // First, try to use the provided language dialect
    if (languageDialect && languageDialect !== "general") {
      selectedDialect = languageDialect;
      console.log(
        `[SPEECH_ANALYSIS] Using provided dialect: ${selectedDialect}`
      );
    } else {
      // If not provided or is 'general', fetch from user profile
      console.log(`[SPEECH_ANALYSIS] Fetching dialect from user profile`);
      try {
        const userProfile = await prisma.userProfile.findUnique({
          where: { userId },
          select: { languageDialect: true },
        });

        if (userProfile?.languageDialect) {
          selectedDialect = userProfile.languageDialect as LanguageDialectType;
          console.log(
            `[SPEECH_ANALYSIS] Found dialect in profile: ${selectedDialect}`
          );
        } else {
          console.log(
            `[SPEECH_ANALYSIS] No dialect found in profile, using general`
          );
        }
      } catch (dbError) {
        console.error(
          `[SPEECH_ANALYSIS] Database error fetching user profile:`,
          {
            userId,
            error: dbError,
          }
        );
        // Will use 'general' as fallback
      }
    }

    // Generate language/dialect-specific prompt
    console.log(
      `[SPEECH_ANALYSIS] Generating analysis prompt for dialect: ${selectedDialect}`
    );
    const prompt = generateAnalysisPrompt(transcript, selectedDialect);

    // Get dialect-specific configuration for additional processing
    const dialectConfig = getDialectPrompt(selectedDialect);
    const profile = getProfileById(selectedDialect);

    console.log(`[SPEECH_ANALYSIS] Analysis configuration:`, {
      userId,
      userEmail,
      selectedDialect,
      profileName: profile?.name || "General",
      promptLength: prompt.length,
      dialectConfigKeys: Object.keys(dialectConfig),
    });

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

    console.log(`[SPEECH_ANALYSIS] Sending request to Gemini API`, {
      userId,
      model: "gemini-1.5-flash",
      promptLength: prompt.length,
    });

    // Generate content with safety settings
    const geminiStartTime = Date.now();
    const result = await model.generateContent(prompt);
    const geminiEndTime = Date.now();
    const response = result.response.text();

    console.log(`[SPEECH_ANALYSIS] Gemini API response received`, {
      userId,
      responseLength: response.length,
      geminiLatency: geminiEndTime - geminiStartTime,
      responsePreview:
        response.substring(0, 200) + (response.length > 200 ? "..." : ""),
    });

    let feedbackObject: FeedbackResponse;

    try {
      console.log(`[SPEECH_ANALYSIS] Parsing Gemini response as JSON`);
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
        console.warn(`[SPEECH_ANALYSIS] Missing fields in Gemini response:`, {
          userId,
          missingFields,
          presentFields: Object.keys(feedbackObject),
        });
        // Handle missing fields by providing default messages
        missingFields.forEach((field) => {
          if (field !== "languageDialectSpecificFeedback") {
            feedbackObject[
              field as keyof Omit<
                FeedbackResponse,
                "languageDialectSpecificFeedback"
              >
            ] = `No specific ${field} feedback available. Please try again with a longer speech sample.`;
          }
        });
      } else {
        console.log(
          `[SPEECH_ANALYSIS] All required fields present in response`,
          {
            userId,
            fields: Object.keys(feedbackObject),
          }
        );
      }

      // Add language/dialect-specific feedback if not 'general'
      if (selectedDialect !== "general" && profile) {
        console.log(
          `[SPEECH_ANALYSIS] Generating dialect-specific tips for ${profile.name}`
        );
        feedbackObject.languageDialectSpecificFeedback =
          generateDialectSpecificTips(selectedDialect, dialectConfig, profile);
      }
    } catch (parseError) {
      console.error(
        `[SPEECH_ANALYSIS] Failed to parse Gemini response as JSON:`,
        {
          userId,
          error: parseError,
          rawResponse: response,
          responseLength: response.length,
        }
      );

      // Extract potential JSON from the response if possible
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log(
          `[SPEECH_ANALYSIS] Attempting to extract JSON from response`,
          {
            userId,
            extractedLength: jsonMatch[0].length,
          }
        );
        try {
          feedbackObject = JSON.parse(jsonMatch[0]);
          console.log(`[SPEECH_ANALYSIS] Successfully parsed extracted JSON`, {
            userId,
          });
        } catch (e: unknown) {
          console.error(`[SPEECH_ANALYSIS] Failed to parse extracted JSON:`, {
            userId,
            error: e,
          });
          // If that fails too, use fallback
          feedbackObject = getFallbackFeedback(selectedDialect, profile);
        }
      } else {
        console.warn(
          `[SPEECH_ANALYSIS] No JSON found in response, using fallback`,
          { userId }
        );
        // Use fallback feedback
        feedbackObject = getFallbackFeedback(selectedDialect, profile);
      }
    }

    console.log(`[SPEECH_ANALYSIS] Validating feedback object`, {
      userId,
      feedbackKeys: Object.keys(feedbackObject),
    });

    // Ensure all feedback entries are strings and have reasonable content
    const validatedFeedback: FeedbackResponse = {
      pronunciation: ensureValidFeedback(
        feedbackObject.pronunciation,
        "pronunciation",
        profile
      ),
      grammar: ensureValidFeedback(feedbackObject.grammar, "grammar", profile),
      fluency: ensureValidFeedback(feedbackObject.fluency, "fluency", profile),
      vocabulary: ensureValidFeedback(
        feedbackObject.vocabulary,
        "vocabulary",
        profile
      ),
      languageDialectSpecificFeedback:
        feedbackObject.languageDialectSpecificFeedback,
    };

    // SAVE FEEDBACK TO DATABASE IF RECORDING ID IS PROVIDED
    if (recordingId) {
      try {
        console.log(`[SPEECH_ANALYSIS] Saving feedback to database`, {
          userId,
          recordingId,
        });

        // Check if feedback already exists for this recording
        const existingFeedback = await prisma.voiceRecordingFeedback.findUnique(
          {
            where: { recordingId },
          }
        );

        if (existingFeedback) {
          console.log(`[SPEECH_ANALYSIS] Updating existing feedback`, {
            userId,
            recordingId,
            existingFeedbackId: existingFeedback.id,
          });

          // Update existing feedback
          await prisma.voiceRecordingFeedback.update({
            where: { recordingId },
            data: {
              pronunciation: validatedFeedback.pronunciation,
              grammar: validatedFeedback.grammar,
              fluency: validatedFeedback.fluency,
              vocabulary: validatedFeedback.vocabulary,
            },
          });
        } else {
          console.log(`[SPEECH_ANALYSIS] Creating new feedback record`, {
            userId,
            recordingId,
          });

          // Create new feedback record
          await prisma.voiceRecordingFeedback.create({
            data: {
              recordingId,
              pronunciation: validatedFeedback.pronunciation,
              grammar: validatedFeedback.grammar,
              fluency: validatedFeedback.fluency,
              vocabulary: validatedFeedback.vocabulary,
            },
          });
        }

        console.log(`[SPEECH_ANALYSIS] Feedback saved successfully`, {
          userId,
          recordingId,
        });
      } catch (dbSaveError) {
        console.error(
          `[SPEECH_ANALYSIS] Failed to save feedback to database:`,
          {
            userId,
            recordingId,
            error: dbSaveError,
          }
        );
        // Don't fail the entire request if database save fails
        // The feedback will still be returned to the client
      }
    } else {
      console.log(
        `[SPEECH_ANALYSIS] No recordingId provided, skipping database save`,
        {
          userId,
        }
      );
    }

    const endTime = Date.now();
    const totalLatency = endTime - startTime;

    // Log analysis for monitoring
    console.log(`[SPEECH_ANALYSIS] Analysis completed successfully`, {
      userId,
      userEmail,
      profileName: profile?.name || "General",
      selectedDialect,
      totalLatency,
      transcriptLength: transcript.length,
      hasDialectSpecificFeedback:
        !!validatedFeedback.languageDialectSpecificFeedback,
      feedbackLengths: {
        pronunciation: validatedFeedback.pronunciation.length,
        grammar: validatedFeedback.grammar.length,
        fluency: validatedFeedback.fluency.length,
        vocabulary: validatedFeedback.vocabulary.length,
      },
      recordingId: recordingId || "not provided",
    });

    return NextResponse.json(validatedFeedback);
  } catch (error) {
    const endTime = Date.now();
    const totalLatency = endTime - startTime;

    console.error(`[SPEECH_ANALYSIS] Unexpected error:`, {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      totalLatency,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(getFallbackFeedback("general"), { status: 500 });
  }
}

// Ensure feedback is a valid string with reasonable content and add dialect-specific context
function ensureValidFeedback(
  feedback: unknown,
  type: string,
  profile?: LanguageDialectProfile
): string {
  console.log(`[SPEECH_ANALYSIS] Validating ${type} feedback`, {
    feedbackType: typeof feedback,
    feedbackLength: typeof feedback === "string" ? feedback.length : 0,
    profileName: profile?.name,
  });

  if (
    typeof feedback !== "string" ||
    feedback.trim().length < 10 ||
    feedback === "undefined" ||
    feedback === "null"
  ) {
    console.warn(`[SPEECH_ANALYSIS] Invalid ${type} feedback, using fallback`, {
      feedbackType: typeof feedback,
      feedbackValue: feedback,
      profileName: profile?.name,
    });

    // Generate dialect-specific fallback feedback
    const dialectInfo = profile ? ` for ${profile.name} speakers` : "";
    return `We couldn't generate specific ${type} feedback${dialectInfo}. Please try again with a clearer or longer speech sample.`;
  }
  return feedback;
}

// Generate dialect-specific tips based on the language profile
function generateDialectSpecificTips(
  languageDialect: LanguageDialectType,
  dialectConfig: DialectPromptConfig,
  profile: LanguageDialectProfile
): string[] {
  console.log(`[SPEECH_ANALYSIS] Generating dialect-specific tips`, {
    languageDialect,
    profileName: profile.name,
    hasTones: profile.tonalSystem?.hasTones,
    pronunciationFocusCount: dialectConfig.pronunciationFocus.length,
  });

  const tips: string[] = [];

  // Add tonal system tips if applicable
  if (profile.tonalSystem?.hasTones) {
    const tonalTip = `Remember that English uses stress patterns, not tones like ${profile.name}. Focus on emphasizing important words rather than using tonal variations.`;
    tips.push(tonalTip);
    console.log(`[SPEECH_ANALYSIS] Added tonal system tip for ${profile.name}`);
  }

  // Add specific pronunciation tips
  if (dialectConfig.pronunciationFocus.length > 0) {
    const pronunciationTip = `Key pronunciation focus for ${
      profile.name
    } speakers: ${dialectConfig.pronunciationFocus.slice(0, 2).join(" and ")}.`;
    tips.push(pronunciationTip);
    console.log(
      `[SPEECH_ANALYSIS] Added pronunciation tip for ${profile.name}`,
      {
        focusAreas: dialectConfig.pronunciationFocus.slice(0, 2),
      }
    );
  }

  // Add cultural context tip
  if (dialectConfig.culturalContext) {
    const culturalTip = `Cultural insight: ${
      dialectConfig.culturalContext.split(".")[0]
    }.`;
    tips.push(culturalTip);
    console.log(
      `[SPEECH_ANALYSIS] Added cultural context tip for ${profile.name}`
    );
  }

  console.log(
    `[SPEECH_ANALYSIS] Generated ${tips.length} dialect-specific tips for ${profile.name}`
  );
  return tips;
}

// Fallback feedback to use when API fails - now with dialect awareness
function getFallbackFeedback(
  languageDialect: LanguageDialectType = "general",
  profile?: LanguageDialectProfile
): FeedbackResponse {
  console.log(`[SPEECH_ANALYSIS] Using fallback feedback`, {
    languageDialect,
    profileName: profile?.name,
  });

  const dialectInfo = profile ? ` for ${profile.name} speakers` : "";

  return {
    pronunciation: `We couldn't analyze your pronunciation in detail${dialectInfo}. Try speaking clearly and at a moderate pace for better analysis.`,
    grammar: `We couldn't analyze your grammatical structure in detail${dialectInfo}. Try providing a longer speech sample for more specific feedback.`,
    fluency: `We couldn't evaluate your speech fluency in detail${dialectInfo}. Consider recording a longer sample with natural conversation.`,
    vocabulary: `We couldn't assess your vocabulary usage in detail${dialectInfo}. Try speaking on a topic that allows you to demonstrate a range of vocabulary.`,
    languageDialectSpecificFeedback:
      languageDialect !== "general" && profile
        ? [
            `Personalized feedback for ${profile.name} speakers will be available with a longer speech sample.`,
            `Focus on areas where ${profile.name} speakers commonly need improvement: pronunciation clarity and grammar structure.`,
          ]
        : undefined,
  };
}
