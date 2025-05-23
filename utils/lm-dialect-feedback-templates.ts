import { LanguageDialectType } from "@/types/user";

export interface FeedbackTemplate {
  languageDialect: LanguageDialectType;
  pronunciationTips: string[];
  grammarTips: string[];
  fluencyTips: string[];
  vocabularyTips: string[];
  culturalNotes: string[];
}

export const feedbackTemplates: Partial<Record<LanguageDialectType, FeedbackTemplate>> = {
  "mandarin-standard": {
    languageDialect: "mandarin-standard",
    pronunciationTips: [
      "Focus on R/L distinction - practice 'rice' vs 'lice' daily",
      "Work on final consonants - pronounce ending sounds clearly",
      "Practice consonant clusters like 'str-', 'spr-', 'scr-'",
      "Remember English uses stress, not tones like Mandarin"
    ],
    grammarTips: [
      "Use articles 'a', 'an', 'the' - they don't exist in Chinese but are essential",
      "Add plural '-s' and past tense '-ed' endings consistently",
      "Stick to Subject-Verb-Object word order",
      "Practice preposition usage - 'in', 'on', 'at' have specific uses"
    ],
    fluencyTips: [
      "Practice stress-timed rhythm instead of syllable-timed",
      "Link words together in connected speech",
      "Reduce translation pauses between thoughts"
    ],
    vocabularyTips: [
      "Learn idiomatic expressions that don't translate from Chinese",
      "Be careful with false friends - similar-sounding words with different meanings",
      "Practice phrasal verbs which are common in English"
    ],
    culturalNotes: [
      "Direct translation from Chinese often doesn't work",
      "English speakers appreciate concise, clear communication"
    ]
  },

  "thai-central": {
    languageDialect: "thai-central",
    pronunciationTips: [
      "Practice R/L distinction - 'rice' vs 'lice'",
      "Work on final consonant pronunciation - 't', 'd', 's' sounds",
      "Practice consonant clusters which don't exist in Thai",
      "Focus on English stress patterns instead of Thai tones"
    ],
    grammarTips: [
      "Use articles and determiners consistently",
      "Practice verb tense formation",
      "Work on passive voice construction",
      "Learn question formation patterns"
    ],
    fluencyTips: [
      "Practice stress-timed rhythm",
      "Work on natural pausing patterns",
      "Focus on connected speech flow"
    ],
    vocabularyTips: [
      "Expand academic vocabulary",
      "Learn business terminology",
      "Practice formal language registers"
    ],
    culturalNotes: [
      "Thai politeness levels don't directly translate to English formality",
      "English directness may seem impolite but is often expected"
    ]
  },

  "vietnamese-northern": {
    languageDialect: "vietnamese-northern",
    pronunciationTips: [
      "Practice consonant clusters which don't exist in Vietnamese",
      "Work on managing six-tone interference with English stress",
      "Focus on final consonant clarity",
      "Practice English syllable structure"
    ],
    grammarTips: [
      "Learn English article system to replace Vietnamese classifiers",
      "Practice verb tense formation",
      "Work on question word placement",
      "Focus on sentence structure adaptation"
    ],
    fluencyTips: [
      "Practice stress-timed rhythm",
      "Work on natural intonation patterns",
      "Focus on connected speech"
    ],
    vocabularyTips: [
      "Understand Chinese and French loanword influences",
      "Learn technical vocabulary",
      "Practice academic terminology"
    ],
    culturalNotes: [
      "Vietnamese indirect communication style may need adaptation",
      "English business communication tends to be more direct"
    ]
  },

  "khmer-phnom-penh": {
    languageDialect: "khmer-phnom-penh",
    pronunciationTips: [
      "Simplify complex Khmer consonant clusters for English",
      "Work on vowel quality distinctions",
      "Practice English word stress patterns",
      "Focus on register-neutral pronunciation"
    ],
    grammarTips: [
      "Adapt from flexible Khmer word order to fixed English order",
      "Practice English verb aspect systems",
      "Learn article usage",
      "Work on question formation"
    ],
    fluencyTips: [
      "Practice English stress-timed rhythm",
      "Work on natural pausing patterns",
      "Focus on connected speech flow"
    ],
    vocabularyTips: [
      "Adapt Sanskrit/Pali loanword patterns to English",
      "Learn modern technical vocabulary",
      "Practice academic language"
    ],
    culturalNotes: [
      "Khmer formal language hierarchy doesn't directly translate",
      "English professional communication has different formality markers"
    ]
  },

  "burmese-standard": {
    languageDialect: "burmese-standard",
    pronunciationTips: [
      "Practice consonant clusters which don't exist in Burmese",
      "Work on three-tone system interference with English stress",
      "Focus on aspiration distinctions",
      "Practice clear vowels without creaky voice"
    ],
    grammarTips: [
      "Adapt from Burmese SOV to English SVO word order",
      "Practice English verb tense systems",
      "Learn article usage",
      "Work on question formation with auxiliaries"
    ],
    fluencyTips: [
      "Practice English stress-timed rhythm",
      "Work on natural intonation patterns",
      "Focus on connected speech"
    ],
    vocabularyTips: [
      "Expand academic and technical vocabulary",
      "Learn formal register expressions",
      "Practice professional terminology"
    ],
    culturalNotes: [
      "Myanmar formal culture translates well to academic English",
      "Buddhist cultural discipline helps with language learning"
    ]
  },

  "lao-vientiane": {
    languageDialect: "lao-vientiane",
    pronunciationTips: [
      "Practice consonant clusters which don't exist in Lao",
      "Work on six-tone interference with English stress",
      "Focus on final consonant pronunciation",
      "Practice English syllable structure"
    ],
    grammarTips: [
      "Adapt from Lao classifiers to English articles",
      "Practice verb tense formation",
      "Work on time reference systems",
      "Learn question formation patterns"
    ],
    fluencyTips: [
      "Practice stress-timed rhythm",
      "Work on natural intonation patterns",
      "Focus on connected speech flow"
    ],
    vocabularyTips: [
      "Expand technical and academic vocabulary",
      "Learn abstract concept expression",
      "Practice formal language registers"
    ],
    culturalNotes: [
      "Lao indirect communication may need adaptation for English directness",
      "Buddhist cultural values can enhance learning discipline"
    ]
  },

  "general": {
    languageDialect: "general",
    pronunciationTips: [
      "Focus on clear articulation",
      "Practice natural rhythm and intonation",
      "Work on confident speaking",
      "Develop consistent pronunciation patterns"
    ],
    grammarTips: [
      "Master standard grammar patterns",
      "Focus on common error correction",
      "Practice sentence structure",
      "Work on verb tense consistency"
    ],
    fluencyTips: [
      "Develop natural speaking rhythm",
      "Practice connected speech",
      "Work on confidence building",
      "Focus on smooth delivery"
    ],
    vocabularyTips: [
      "Expand academic vocabulary",
      "Learn professional terminology",
      "Practice everyday communication",
      "Master idiomatic expressions"
    ],
    culturalNotes: [
      "English communication values clarity and directness",
      "Professional contexts require formal language use"
    ]
  }
};

export function getFeedbackTemplate(languageDialect: LanguageDialectType): FeedbackTemplate {
  return feedbackTemplates[languageDialect] || feedbackTemplates.general!;
}

export function generateDialectSpecificFeedback(
  languageDialect: LanguageDialectType,
  category: 'pronunciation' | 'grammar' | 'fluency' | 'vocabulary'
): string[] {
  const template = getFeedbackTemplate(languageDialect);
  
  switch (category) {
    case 'pronunciation':
      return template.pronunciationTips;
    case 'grammar':
      return template.grammarTips;
    case 'fluency':
      return template.fluencyTips;
    case 'vocabulary':
      return template.vocabularyTips;
    default:
      return [];
  }
}