import { LanguageDialectType } from "@/types/user";
import { getProfileById } from "./lm-language-dialect-profiles";

export interface DialectPromptConfig {
  languageDialect: LanguageDialectType;
  systemPrompt: string;
  pronunciationFocus: string[];
  grammarFocus: string[];
  vocabularyFocus: string[];
  culturalContext: string;
}

export const dialectPrompts: Record<LanguageDialectType, DialectPromptConfig> = {
  // CHINA
  "mandarin-standard": {
    languageDialect: "mandarin-standard",
    systemPrompt: `You are analyzing English speech from a Standard Mandarin speaker. Focus on tone-stress interference, R/L distinctions, consonant clusters, and final consonant pronunciation. Provide specific feedback considering the speaker's tonal language background and syllable-timed rhythm patterns.`,
    pronunciationFocus: [
      "R/L sound distinction (rice vs lice)",
      "Consonant clusters (str-, spr-, scr-)",
      "Final consonant clarity (-s, -ed, -t, -d)",
      "Th-sound pronunciation",
      "Stress-timed rhythm vs syllable-timed"
    ],
    grammarFocus: [
      "Article usage (a, an, the)",
      "Plural and past tense endings",
      "Subject-verb agreement",
      "Preposition usage",
      "Question formation"
    ],
    vocabularyFocus: [
      "False friends from Chinese",
      "Academic vocabulary",
      "Idiomatic expressions",
      "Business terminology"
    ],
    culturalContext: "Consider the influence of Mandarin's four-tone system on English stress patterns and the absence of consonant clusters in Chinese."
  },

  "mandarin-beijing": {
    languageDialect: "mandarin-beijing",
    systemPrompt: `You are analyzing English speech from a Beijing Mandarin speaker. Focus on Beijing dialect features, erhua (r-coloring), and northern Chinese pronunciation patterns.`,
    pronunciationFocus: [
      "Beijing dialect r-coloring (erhua)",
      "Northern pronunciation features",
      "Tone-stress interference",
      "Consonant cluster difficulties"
    ],
    grammarFocus: [
      "Beijing dialect grammar patterns",
      "Northern Chinese structures",
      "Standard language adaptation"
    ],
    vocabularyFocus: [
      "Beijing dialect vocabulary",
      "Northern Chinese terminology",
      "Cultural capital language"
    ],
    culturalContext: "Consider Beijing Mandarin with erhua (r-coloring) and cultural capital influences."
  },

  "mandarin-northeastern": {
    languageDialect: "mandarin-northeastern",
    systemPrompt: `You are analyzing English speech from a Northeastern Mandarin speaker. Focus on northeastern dialect features and regional pronunciation patterns.`,
    pronunciationFocus: [
      "Northeastern dialect features",
      "Regional pronunciation patterns",
      "Tone variations from standard"
    ],
    grammarFocus: [
      "Northeastern dialect grammar",
      "Regional language patterns",
      "Standard language adaptation"
    ],
    vocabularyFocus: [
      "Northeastern vocabulary differences",
      "Regional terminology",
      "Industrial language background"
    ],
    culturalContext: "Consider Northeastern Mandarin regional features and industrial background."
  },

  "cantonese-guangzhou": {
    languageDialect: "cantonese-guangzhou",
    systemPrompt: `You are analyzing English speech from a Guangzhou Cantonese speaker. Focus on mainland Cantonese features and traditional pronunciation patterns.`,
    pronunciationFocus: [
      "Mainland Cantonese features",
      "Traditional pronunciation patterns",
      "Nine-tone system interference"
    ],
    grammarFocus: [
      "Guangzhou Cantonese grammar",
      "Traditional language patterns",
      "Mandarin influence adaptation"
    ],
    vocabularyFocus: [
      "Guangzhou vocabulary patterns",
      "Business terminology",
      "Traditional cultural language"
    ],
    culturalContext: "Consider Guangzhou Cantonese with traditional features and business center influences."
  },

  "wu-shanghai": {
    languageDialect: "wu-shanghai",
    systemPrompt: `You are analyzing English speech from a Shanghai Wu speaker. Focus on Wu language family features and Shanghai metropolitan influences.`,
    pronunciationFocus: [
      "Wu language family features",
      "Shanghai metropolitan accent",
      "Tone system differences"
    ],
    grammarFocus: [
      "Wu to Mandarin to English adaptation",
      "Metropolitan language patterns",
      "International exposure influences"
    ],
    vocabularyFocus: [
      "Shanghai metropolitan vocabulary",
      "Business and finance terminology",
      "International language exposure"
    ],
    culturalContext: "Consider Shanghai Wu language features and international metropolitan influences."
  },

  "min-fujian": {
    languageDialect: "min-fujian",
    systemPrompt: `You are analyzing English speech from a Fujian Min speaker. Focus on Min language family features and coastal dialect characteristics.`,
    pronunciationFocus: [
      "Min language family features",
      "Coastal dialect pronunciation",
      "Tone system variations"
    ],
    grammarFocus: [
      "Min to Mandarin adaptation",
      "Coastal language patterns",
      "Maritime cultural influences"
    ],
    vocabularyFocus: [
      "Fujian dialect vocabulary",
      "Maritime terminology",
      "Overseas Chinese language"
    ],
    culturalContext: "Consider Fujian Min language features and maritime cultural background."
  },

  "hakka-taiwan": {
    languageDialect: "hakka-taiwan",
    systemPrompt: `You are analyzing English speech from a Taiwan Hakka speaker. Focus on Hakka language features and Taiwan cultural influences.`,
    pronunciationFocus: [
      "Hakka language features",
      "Taiwan pronunciation patterns",
      "Tone system characteristics"
    ],
    grammarFocus: [
      "Hakka to Mandarin adaptation",
      "Taiwan language patterns",
      "Cultural preservation influences"
    ],
    vocabularyFocus: [
      "Hakka cultural vocabulary",
      "Taiwan terminology",
      "Cultural preservation language"
    ],
    culturalContext: "Consider Taiwan Hakka language features and cultural preservation context."
  },

  "cantonese-hongkong": {
    languageDialect: "cantonese-hongkong",
    systemPrompt: `You are analyzing English speech from a Hong Kong Cantonese speaker. Focus on complex tone interference (6-9 tones), code-switching patterns, final consonant pronunciation, and vowel system differences. Consider the bilingual English-Cantonese environment.`,
    pronunciationFocus: [
      "Complex tone-stress interference",
      "Final consonant pronunciation",
      "Vowel length distinctions",
      "Code-switching reduction",
      "Hong Kong English accent features"
    ],
    grammarFocus: [
      "Reducing Cantonese-English code-switching",
      "English word order patterns",
      "Conditional structures",
      "Formal vs informal registers"
    ],
    vocabularyFocus: [
      "Distinguishing English vs Cantonese loanwords",
      "Business English terminology",
      "Academic vocabulary",
      "International communication"
    ],
    culturalContext: "Consider the complex tone system of Cantonese (6-9 tones) and the bilingual environment of Hong Kong with frequent code-switching."
  },

  // MYANMAR
  "burmese-standard": {
    languageDialect: "burmese-standard",
    systemPrompt: `You are analyzing English speech from a Standard Burmese speaker. Focus on three-tone system interference, consonant cluster difficulties, creaky voice phonation, and SOV to SVO word order adaptation.`,
    pronunciationFocus: [
      "Three-tone system interference",
      "Consonant cluster production",
      "Aspiration distinctions",
      "Creaky voice management",
      "Syllable structure adaptation"
    ],
    grammarFocus: [
      "SOV to SVO word order",
      "Verb tense systems",
      "Question formation",
      "Article usage",
      "Passive voice construction"
    ],
    vocabularyFocus: [
      "Academic and technical terms",
      "Formal vs informal registers",
      "International vocabulary",
      "Professional terminology"
    ],
    culturalContext: "Consider Burmese three-tone system (high, low, creaky) and the rich consonant inventory with aspiration distinctions."
  },

  "burmese-yangon": {
    languageDialect: "burmese-yangon",
    systemPrompt: `You are analyzing English speech from a Yangon Burmese speaker. Focus on urban dialect features, tone pattern variations, and metropolitan language influences.`,
    pronunciationFocus: [
      "Urban tone pattern variations",
      "Metropolitan accent features",
      "Consonant cluster adaptation",
      "Regional pronunciation patterns"
    ],
    grammarFocus: [
      "Urban vs standard grammar patterns",
      "Colloquial language influence",
      "Formal register development"
    ],
    vocabularyFocus: [
      "Urban vocabulary patterns",
      "Business terminology",
      "Modern technical vocabulary"
    ],
    culturalContext: "Consider urban Yangon dialect variations and metropolitan language influences."
  },

  "burmese-mandalay": {
    languageDialect: "burmese-mandalay",
    systemPrompt: `You are analyzing English speech from a Mandalay Burmese speaker. Focus on regional dialect features and cultural center language patterns.`,
    pronunciationFocus: [
      "Regional tone variations",
      "Cultural center accent features",
      "Traditional pronunciation patterns"
    ],
    grammarFocus: [
      "Regional grammar variations",
      "Traditional language patterns",
      "Standard language adaptation"
    ],
    vocabularyFocus: [
      "Regional vocabulary differences",
      "Cultural terminology",
      "Academic language development"
    ],
    culturalContext: "Consider Mandalay regional dialect features and cultural center language patterns."
  },

  "shan-northern": {
    languageDialect: "shan-northern",
    systemPrompt: `You are analyzing English speech from a Northern Shan speaker. Focus on Tai language family influences and tonal pattern differences from Burmese.`,
    pronunciationFocus: [
      "Tai language family influences",
      "Tonal pattern differences",
      "Consonant system variations"
    ],
    grammarFocus: [
      "Shan to English grammar adaptation",
      "Minority language patterns",
      "Standard language development"
    ],
    vocabularyFocus: [
      "Minority language vocabulary",
      "Cultural concept translation",
      "Educational terminology"
    ],
    culturalContext: "Consider Northern Shan as part of Tai language family with different tonal patterns from Burmese."
  },

  "karen-sgaw": {
    languageDialect: "karen-sgaw",
    systemPrompt: `You are analyzing English speech from a Sgaw Karen speaker. Focus on Tibeto-Burman language family influences and minority language background.`,
    pronunciationFocus: [
      "Tibeto-Burman language influences",
      "Minority language pronunciation patterns",
      "Consonant system differences"
    ],
    grammarFocus: [
      "Karen to English grammar adaptation",
      "Minority language structures",
      "Educational language development"
    ],
    vocabularyFocus: [
      "Minority language vocabulary",
      "Educational terminology",
      "Cultural preservation language"
    ],
    culturalContext: "Consider Sgaw Karen as Tibeto-Burman language with minority language background."
  },

  // LAOS
  "lao-vientiane": {
    languageDialect: "lao-vientiane",
    systemPrompt: `You are analyzing English speech from a Vientiane Lao speaker. Focus on six-tone system interference, consonant cluster absence, vowel length distinctions, and limited syllable codas.`,
    pronunciationFocus: [
      "Six-tone system interference",
      "Consonant cluster production",
      "Vowel length distinctions",
      "Final consonant pronunciation",
      "Syllable structure adaptation"
    ],
    grammarFocus: [
      "Classifier to article systems",
      "Verb serialization patterns",
      "Time reference systems",
      "Question formation"
    ],
    vocabularyFocus: [
      "Technical and academic vocabulary",
      "Abstract concept expression",
      "Formal language registers",
      "International terminology"
    ],
    culturalContext: "Consider Lao's six-tone system and the absence of consonant clusters in the native language."
  },

  "lao-luang-prabang": {
    languageDialect: "lao-luang-prabang",
    systemPrompt: `You are analyzing English speech from a Luang Prabang Lao speaker. Focus on northern dialect features and cultural heritage language patterns.`,
    pronunciationFocus: [
      "Northern Lao dialect features",
      "Cultural heritage pronunciation",
      "Regional tone variations"
    ],
    grammarFocus: [
      "Northern dialect grammar patterns",
      "Traditional language structures",
      "Standard language adaptation"
    ],
    vocabularyFocus: [
      "Cultural heritage vocabulary",
      "Tourism-related terminology",
      "Traditional concept expression"
    ],
    culturalContext: "Consider Luang Prabang northern dialect features and UNESCO World Heritage cultural context."
  },

  "lao-southern": {
    languageDialect: "lao-southern",
    systemPrompt: `You are analyzing English speech from a Southern Lao speaker. Focus on southern dialect variations and regional language patterns.`,
    pronunciationFocus: [
      "Southern dialect pronunciation",
      "Regional tone patterns",
      "Border area influences"
    ],
    grammarFocus: [
      "Southern dialect grammar",
      "Regional language patterns",
      "Cross-border influences"
    ],
    vocabularyFocus: [
      "Regional vocabulary differences",
      "Cross-border terminology",
      "Agricultural vocabulary"
    ],
    culturalContext: "Consider Southern Lao dialect variations and cross-border linguistic influences."
  },

  "hmong-white": {
    languageDialect: "hmong-white",
    systemPrompt: `You are analyzing English speech from a White Hmong speaker. Focus on complex tone system (7-8 tones) and Hmong-Mien language family influences.`,
    pronunciationFocus: [
      "Complex tone system (7-8 tones)",
      "Hmong-Mien language influences",
      "Consonant cluster patterns"
    ],
    grammarFocus: [
      "Hmong to English grammar adaptation",
      "Minority language structures",
      "Educational language development"
    ],
    vocabularyFocus: [
      "Minority language vocabulary",
      "Cultural concept translation",
      "Educational terminology"
    ],
    culturalContext: "Consider White Hmong's complex 7-8 tone system and Hmong-Mien language family background."
  },

  "khmu-northern": {
    languageDialect: "khmu-northern",
    systemPrompt: `You are analyzing English speech from a Northern Khmu speaker. Focus on Mon-Khmer language family influences and minority language background.`,
    pronunciationFocus: [
      "Mon-Khmer language influences",
      "Minority language pronunciation",
      "Consonant system differences"
    ],
    grammarFocus: [
      "Khmu to English adaptation",
      "Minority language patterns",
      "Educational development"
    ],
    vocabularyFocus: [
      "Minority language vocabulary",
      "Cultural terminology",
      "Educational language"
    ],
    culturalContext: "Consider Northern Khmu as Mon-Khmer language with minority language background."
  },

  // THAILAND
  "thai-central": {
    languageDialect: "thai-central",
    systemPrompt: `You are analyzing English speech from a Central Thai speaker. Focus on five-tone system interference, R/L confusion, final consonant pronunciation, and consonant cluster difficulties.`,
    pronunciationFocus: [
      "Five-tone system interference",
      "R/L sound distinction",
      "Final consonant pronunciation",
      "Consonant cluster production",
      "Aspirated/unaspirated distinctions"
    ],
    grammarFocus: [
      "Article and determiner usage",
      "Verb tense formation",
      "Passive voice construction",
      "Question formation patterns"
    ],
    vocabularyFocus: [
      "Academic vocabulary expansion",
      "Business terminology",
      "Technical language",
      "Formal registers"
    ],
    culturalContext: "Consider Thai's five-tone system (mid, low, falling, high, rising) and syllable-timed rhythm."
  },

  "thai-northern": {
    languageDialect: "thai-northern",
    systemPrompt: `You are analyzing English speech from a Northern Thai (Lanna) speaker. Focus on six-tone system complexity, vowel system differences, and regional accent features.`,
    pronunciationFocus: [
      "Six-tone system complexity",
      "Vowel system differences from Central Thai",
      "Regional accent features",
      "Lanna language influences"
    ],
    grammarFocus: [
      "Standard Thai vs Northern patterns",
      "Formal language registers",
      "Academic language structures"
    ],
    vocabularyFocus: [
      "Standard vs regional vocabulary",
      "Professional terminology",
      "Cultural concept translation"
    ],
    culturalContext: "Consider Northern Thai (Lanna) six-tone system and cultural heritage influences."
  },

  "thai-northeastern": {
    languageDialect: "thai-northeastern",
    systemPrompt: `You are analyzing English speech from a Northeastern Thai (Isan) speaker. Focus on Lao language influences and regional dialect features.`,
    pronunciationFocus: [
      "Lao language influences",
      "Regional dialect pronunciation",
      "Cross-border linguistic features"
    ],
    grammarFocus: [
      "Isan dialect grammar patterns",
      "Standard Thai adaptation",
      "Regional language structures"
    ],
    vocabularyFocus: [
      "Regional vocabulary differences",
      "Agricultural terminology",
      "Cross-border vocabulary"
    ],
    culturalContext: "Consider Northeastern Thai (Isan) with strong Lao language influences and regional identity."
  },

  "thai-southern": {
    languageDialect: "thai-southern",
    systemPrompt: `You are analyzing English speech from a Southern Thai speaker. Focus on southern dialect features and Malay language influences.`,
    pronunciationFocus: [
      "Southern dialect pronunciation",
      "Malay language influences",
      "Regional accent features"
    ],
    grammarFocus: [
      "Southern dialect grammar",
      "Regional language patterns",
      "Standard language adaptation"
    ],
    vocabularyFocus: [
      "Regional vocabulary differences",
      "Maritime terminology",
      "Cross-cultural vocabulary"
    ],
    culturalContext: "Consider Southern Thai dialect with Malay language influences and maritime culture."
  },

  // CAMBODIA
  "khmer-phnom-penh": {
    languageDialect: "khmer-phnom-penh",
    systemPrompt: `You are analyzing English speech from a Phnom Penh Khmer speaker. Focus on non-tonal to stress-timed adaptation, complex consonant clusters, vowel system differences, and register distinctions.`,
    pronunciationFocus: [
      "Non-tonal stress pattern adaptation",
      "Complex consonant cluster simplification",
      "Vowel quality distinctions",
      "Register-based vowel changes",
      "Word stress patterns"
    ],
    grammarFocus: [
      "Flexible to fixed word order",
      "Verb aspect systems",
      "Classifier usage adaptation",
      "Question formation"
    ],
    vocabularyFocus: [
      "Sanskrit/Pali loanword patterns",
      "Modern technical vocabulary",
      "Academic language development",
      "International terminology"
    ],
    culturalContext: "Consider Khmer's non-tonal nature but complex register system affecting vowel quality, and rich consonant cluster system."
  },

  "khmer-battambang": {
    languageDialect: "khmer-battambang",
    systemPrompt: `You are analyzing English speech from a Battambang Khmer speaker. Focus on northwestern dialect features and regional pronunciation patterns.`,
    pronunciationFocus: [
      "Northwestern dialect features",
      "Regional pronunciation patterns",
      "Rural accent characteristics"
    ],
    grammarFocus: [
      "Regional dialect grammar",
      "Rural language patterns",
      "Standard language adaptation"
    ],
    vocabularyFocus: [
      "Regional vocabulary differences",
      "Agricultural terminology",
      "Rural community language"
    ],
    culturalContext: "Consider Battambang northwestern dialect features and agricultural community background."
  },

  "khmer-siem-reap": {
    languageDialect: "khmer-siem-reap",
    systemPrompt: `You are analyzing English speech from a Siem Reap Khmer speaker. Focus on tourism industry influences and cultural heritage language patterns.`,
    pronunciationFocus: [
      "Tourism industry pronunciation",
      "Cultural heritage accent",
      "International exposure influences"
    ],
    grammarFocus: [
      "Tourism-related grammar patterns",
      "Cultural explanation structures",
      "International communication"
    ],
    vocabularyFocus: [
      "Tourism industry vocabulary",
      "Cultural heritage terminology",
      "International visitor communication"
    ],
    culturalContext: "Consider Siem Reap's tourism industry exposure and Angkor cultural heritage context."
  },

  // VIETNAM
  "vietnamese-northern": {
    languageDialect: "vietnamese-northern",
    systemPrompt: `You are analyzing English speech from a Northern Vietnamese (Hanoi) speaker. Focus on six-tone system interference, consonant cluster absence, complex vowel system, and syllable-timed rhythm.`,
    pronunciationFocus: [
      "Six-tone system interference",
      "Consonant cluster production",
      "Complex vowel system adaptation",
      "Glottal stop management",
      "Final consonant clarity"
    ],
    grammarFocus: [
      "Classifier to article systems",
      "Verb tense formation",
      "Question word placement",
      "Sentence structure adaptation"
    ],
    vocabularyFocus: [
      "Chinese loanword patterns",
      "French loanword influence",
      "Technical vocabulary",
      "Academic terminology"
    ],
    culturalContext: "Consider Northern Vietnamese six-tone system (level, rising, falling, low rising, high broken, low broken) and Chinese/French linguistic influences."
  },

  "vietnamese-central": {
    languageDialect: "vietnamese-central",
    systemPrompt: `You are analyzing English speech from a Central Vietnamese speaker. Focus on regional tone variations and central dialect features.`,
    pronunciationFocus: [
      "Central dialect tone variations",
      "Regional pronunciation features",
      "Consonant system differences"
    ],
    grammarFocus: [
      "Central dialect grammar patterns",
      "Regional language structures",
      "Standard language adaptation"
    ],
    vocabularyFocus: [
      "Regional vocabulary differences",
      "Cultural terminology",
      "Historical language influences"
    ],
    culturalContext: "Consider Central Vietnamese dialect variations and historical cultural influences."
  },

  "vietnamese-southern": {
    languageDialect: "vietnamese-southern",
    systemPrompt: `You are analyzing English speech from a Southern Vietnamese (Ho Chi Minh) speaker. Focus on simplified five-tone system, consonant mergers, and metropolitan influences.`,
    pronunciationFocus: [
      "Simplified five-tone system",
      "Consonant sound mergers",
      "Metropolitan accent features",
      "Faster speech tempo adaptation"
    ],
    grammarFocus: [
      "Colloquial vs formal patterns",
      "Regional grammar variations",
      "Standard language registers"
    ],
    vocabularyFocus: [
      "Regional vocabulary differences",
      "Business and technical terms",
      "International vocabulary",
      "Modern terminology"
    ],
    culturalContext: "Consider Southern Vietnamese simplified five-tone system with merged patterns and Ho Chi Minh City metropolitan influences."
  },

  // GENERAL
  "general": {
    languageDialect: "general",
    systemPrompt: `You are analyzing English speech from a general language background. Provide comprehensive feedback on pronunciation, grammar, fluency, and vocabulary without specific native language assumptions.`,
    pronunciationFocus: [
      "Clear articulation",
      "Natural rhythm and intonation",
      "Confident speaking",
      "Standard pronunciation patterns"
    ],
    grammarFocus: [
      "Standard grammar patterns",
      "Common error correction",
      "Fluency development",
      "Sentence structure"
    ],
    vocabularyFocus: [
      "Academic vocabulary",
      "Professional terminology",
      "Everyday communication",
      "Idiomatic expressions"
    ],
    culturalContext: "Provide general English learning feedback suitable for learners from varied linguistic backgrounds."
  }
};

export function getDialectPrompt(languageDialect: LanguageDialectType): DialectPromptConfig {
  return dialectPrompts[languageDialect] || dialectPrompts.general;
}

export function generateAnalysisPrompt(
  transcript: string, 
  languageDialect: LanguageDialectType
): string {
  const config = getDialectPrompt(languageDialect);
  const profile = getProfileById(languageDialect);
  
  return `${config.systemPrompt}

SPEAKER PROFILE:
- Language/Dialect: ${profile?.name || 'General'}
- Native Name: ${profile?.nativeName || 'N/A'}
- Cultural Context: ${config.culturalContext}

ANALYSIS FOCUS AREAS:
Pronunciation: ${config.pronunciationFocus.join(', ')}
Grammar: ${config.grammarFocus.join(', ')}
Vocabulary: ${config.vocabularyFocus.join(', ')}

TRANSCRIPT TO ANALYZE:
"${transcript}"

CRITICAL: You must return ONLY a valid JSON object with exactly these four keys: pronunciation, grammar, fluency, vocabulary.
Each value should be a detailed paragraph (3-5 sentences) with specific examples from the transcript and actionable advice.
Do not include any markdown formatting, headers, or additional text outside the JSON object.

Example format:
{
  "pronunciation": "Your detailed pronunciation feedback here...",
  "grammar": "Your detailed grammar feedback here...",
  "fluency": "Your detailed fluency feedback here...",
  "vocabulary": "Your detailed vocabulary feedback here..."
}

Focus on being encouraging while providing specific, actionable feedback that considers the speaker's ${profile?.name || 'general'} linguistic background.`;
}