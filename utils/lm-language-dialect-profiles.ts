import { LanguageDialectType, CountryType } from "@/types/user";

export interface LanguageDialectProfile {
  id: LanguageDialectType;
  country: CountryType;
  name: string;
  nativeName: string;
  description: string;
  flag: string;
  flagCode: string;
  speakers: string;
  commonChallenges: string[];
  phoneticFeatures: string[];
  tonalSystem?: {
    hasTones: boolean;
    toneCount?: number;
    description: string;
  };
  examples: {
    pronunciation: string[];
    grammar: string[];
    vocabulary: string[];
  };
  learningFocus: string[];
}

export const lancangMekongProfiles: LanguageDialectProfile[] = [
  // CHINA
  {
    id: "mandarin-standard",
    country: "china",
    name: "Standard Mandarin",
    nativeName: "普通话 (Pǔtōnghuà)",
    description: "Standard Chinese based on Beijing pronunciation",
    flag: "🇨🇳",
    flagCode: "CN",
    speakers: "918 million native speakers",
    commonChallenges: [
      "Tone vs stress patterns in English",
      "R/L sound distinction",
      "Consonant clusters (str-, spr-, scr-)",
      "Plural and past tense endings",
      "Voiced/voiceless consonant pairs"
    ],
    phoneticFeatures: [
      "Four lexical tones plus neutral tone",
      "No consonant clusters",
      "Limited final consonants",
      "Syllable-timed rhythm"
    ],
    tonalSystem: {
      hasTones: true,
      toneCount: 4,
      description: "Four main tones affect meaning, influencing English stress patterns"
    },
    examples: {
      pronunciation: [
        "Distinguishing 'rice' vs 'lice'",
        "Pronouncing 'th' sounds correctly",
        "Adding clear '-s', '-ed' endings"
      ],
      grammar: [
        "Using articles 'a', 'an', 'the'",
        "Correct verb tense formation",
        "Subject-verb agreement"
      ],
      vocabulary: [
        "False friends: 'actually' vs Chinese usage",
        "Preposition usage differences",
        "Idiomatic expressions"
      ]
    },
    learningFocus: [
      "Stress-timed rhythm practice",
      "Consonant cluster training",
      "Intonation patterns for questions/statements"
    ]
  },
  {
    id: "mandarin-beijing",
    country: "china",
    name: "Beijing Mandarin",
    nativeName: "北京话 (Běijīnghuà)",
    description: "Beijing dialect with erhua (r-coloring) features",
    flag: "🇨🇳",
    flagCode: "CN",
    speakers: "22 million native speakers",
    commonChallenges: [
      "Beijing dialect r-coloring (erhua)",
      "Northern pronunciation features",
      "Tone-stress interference",
      "Consonant cluster difficulties"
    ],
    phoneticFeatures: [
      "Erhua (r-coloring) features",
      "Four tones plus neutral",
      "Regional pronunciation variations",
      "Cultural capital influences"
    ],
    tonalSystem: {
      hasTones: true,
      toneCount: 4,
      description: "Beijing dialect with distinctive r-coloring affects English pronunciation"
    },
    examples: {
      pronunciation: [
        "Managing erhua in English pronunciation",
        "Northern Chinese accent adaptation",
        "Cultural capital language patterns"
      ],
      grammar: [
        "Beijing dialect grammar patterns",
        "Standard language adaptation",
        "Formal vs colloquial usage"
      ],
      vocabulary: [
        "Beijing dialect vocabulary",
        "Cultural capital terminology",
        "Northern Chinese expressions"
      ]
    },
    learningFocus: [
      "Erhua management in English",
      "Standard pronunciation training",
      "Accent neutralization"
    ]
  },  {
    id: "mandarin-northeastern",
    country: "china",
    name: "Northeastern Mandarin",
    nativeName: "东北话 (Dōngběihuà)",
    description: "Northeastern Chinese dialect",
    flag: "🇨🇳",
    flagCode: "CN",
    speakers: "100 million native speakers",
    commonChallenges: [
      "Northeastern dialect features",
      "Regional pronunciation patterns",
      "Tone variations from standard",
      "Industrial language background"
    ],
    phoneticFeatures: [
      "Regional tone variations",
      "Northeastern accent features",
      "Industrial terminology influence",
      "Distinct pronunciation patterns"
    ],
    tonalSystem: {
      hasTones: true,
      toneCount: 4,
      description: "Northeastern tone patterns with regional variations"
    },
    examples: {
      pronunciation: [
        "Northeastern accent management",
        "Regional pronunciation adaptation",
        "Standard tone pattern training"
      ],
      grammar: [
        "Regional grammar patterns",
        "Standard language adaptation",
        "Formal register development"
      ],
      vocabulary: [
        "Northeastern vocabulary",
        "Industrial terminology",
        "Regional expressions"
      ]
    },
    learningFocus: [
      "Standard pronunciation training",
      "Regional accent neutralization",
      "Formal language development"
    ]
  },
  {
    id: "cantonese-hongkong",
    country: "china",
    name: "Hong Kong Cantonese",
    nativeName: "廣東話 (Gwóngdūngwá)",
    description: "Cantonese dialect spoken in Hong Kong",
    flag: "🇭🇰",
    flagCode: "HK",
    speakers: "7.5 million native speakers",
    commonChallenges: [
      "Complex tone system interference",
      "Final consonant pronunciation",
      "Vowel system differences",
      "Code-switching habits with English"
    ],
    phoneticFeatures: [
      "Six to nine tones depending on analysis",
      "More final consonants than Mandarin",
      "Different vowel inventory",
      "Frequent English loanwords"
    ],
    tonalSystem: {
      hasTones: true,
      toneCount: 6,
      description: "Six main tones create complex interference with English stress"
    },
    examples: {
      pronunciation: [
        "Managing tone-stress interference",
        "Pronouncing word-final consonants",
        "Vowel length distinctions"
      ],
      grammar: [
        "Reducing code-switching",
        "English word order patterns",
        "Conditional sentence structures"
      ],
      vocabulary: [
        "Distinguishing English vs Cantonese loanwords",
        "Business English terminology",
        "Academic vocabulary"
      ]
    },
    learningFocus: [
      "Tone neutralization in English",
      "Final consonant clarity",
      "Formal register usage"
    ]
  },  {
    id: "cantonese-guangzhou",
    country: "china",
    name: "Guangzhou Cantonese",
    nativeName: "广州话 (Gwóngzāuwá)",
    description: "Mainland Cantonese from Guangzhou",
    flag: "🇨🇳",
    flagCode: "CN",
    speakers: "60 million native speakers",
    commonChallenges: [
      "Mainland Cantonese features",
      "Traditional pronunciation patterns",
      "Nine-tone system interference",
      "Business center influences"
    ],
    phoneticFeatures: [
      "Nine-tone system complexity",
      "Traditional Cantonese features",
      "Business terminology integration",
      "Regional accent characteristics"
    ],
    tonalSystem: {
      hasTones: true,
      toneCount: 9,
      description: "Complex nine-tone system creates significant English interference"
    },
    examples: {
      pronunciation: [
        "Complex tone management",
        "Traditional pronunciation features",
        "Business accent adaptation"
      ],
      grammar: [
        "Cantonese grammar patterns",
        "Mandarin influence adaptation",
        "Business communication structures"
      ],
      vocabulary: [
        "Traditional Cantonese vocabulary",
        "Business terminology",
        "Cultural expressions"
      ]
    },
    learningFocus: [
      "Complex tone neutralization",
      "Business English development",
      "Standard pronunciation training"
    ]
  },
  {
    id: "wu-shanghai",
    country: "china",
    name: "Shanghai Wu",
    nativeName: "上海话 (Zaonhae-gheú)",
    description: "Wu dialect from Shanghai metropolitan area",
    flag: "🇨🇳",
    flagCode: "CN",
    speakers: "14 million native speakers",
    commonChallenges: [
      "Wu language family features",
      "Metropolitan accent influences",
      "Different tone system",
      "International exposure effects"
    ],
    phoneticFeatures: [
      "Wu language family characteristics",
      "Metropolitan pronunciation features",
      "International language exposure",
      "Business center influences"
    ],
    tonalSystem: {
      hasTones: true,
      toneCount: 5,
      description: "Wu tonal system with metropolitan influences"
    },
    examples: {
      pronunciation: [
        "Wu language adaptation",
        "Metropolitan accent features",
        "International pronunciation exposure"
      ],
      grammar: [
        "Wu to Mandarin to English progression",
        "Metropolitan language patterns",
        "International business structures"
      ],
      vocabulary: [
        "Shanghai metropolitan vocabulary",
        "International business terms",
        "Financial terminology"
      ]
    },
    learningFocus: [
      "Wu language neutralization",
      "International pronunciation standards",
      "Business communication skills"
    ]
  },
  // MYANMAR
  {
    id: "burmese-standard",
    country: "myanmar",
    name: "Standard Burmese",
    nativeName: "မြန်မာစာ (Myanma sa)",
    description: "Official language of Myanmar",
    flag: "🇲🇲",
    flagCode: "MM",
    speakers: "33 million native speakers",
    commonChallenges: [
      "Tonal language interference",
      "Consonant cluster difficulties",
      "Vowel system differences",
      "Aspiration distinctions"
    ],
    phoneticFeatures: [
      "Three-tone system",
      "Rich consonant inventory",
      "Creaky voice phonation",
      "Syllable structure differences"
    ],
    tonalSystem: {
      hasTones: true,
      toneCount: 3,
      description: "Three tones (high, low, creaky) affect English stress patterns"
    },
    examples: {
      pronunciation: [
        "Distinguishing aspirated/unaspirated consonants",
        "Producing consonant clusters",
        "Managing creaky voice in English"
      ],
      grammar: [
        "English word order (SOV to SVO)",
        "Verb tense systems",
        "Question formation patterns"
      ],
      vocabulary: [
        "Academic and technical terms",
        "Formal vs informal registers",
        "Idiomatic expressions"
      ]
    },
    learningFocus: [
      "Consonant cluster practice",
      "Stress pattern training",
      "Intonation for different sentence types"
    ]
  },
  
  // THAILAND
  {
    id: "thai-central",
    country: "thailand",
    name: "Central Thai",
    nativeName: "ภาษาไทย (Phasa Thai)",
    description: "Standard Thai based on Central region",
    flag: "🇹🇭",
    flagCode: "TH",
    speakers: "20 million native speakers",
    commonChallenges: [
      "Five-tone system interference",
      "R/L sound confusion",
      "Final consonant pronunciation",
      "Consonant cluster difficulties"
    ],
    phoneticFeatures: [
      "Five lexical tones",
      "Aspirated/unaspirated distinction",
      "No consonant clusters",
      "Syllable-timed rhythm"
    ],
    tonalSystem: {
      hasTones: true,
      toneCount: 5,
      description: "Five tones (mid, low, falling, high, rising) interfere with English stress"
    },
    examples: {
      pronunciation: [
        "Distinguishing 'rice' vs 'lice'",
        "Pronouncing final 't', 'd', 's' sounds",
        "Managing consonant clusters"
      ],
      grammar: [
        "Using articles and determiners",
        "Verb tense formation",
        "Passive voice construction"
      ],
      vocabulary: [
        "Academic vocabulary expansion",
        "Business terminology",
        "Technical language"
      ]
    },
    learningFocus: [
      "R/L distinction training",
      "Final consonant practice",
      "Stress pattern development"
    ]
  },
  // LAOS
  {
    id: "lao-vientiane",
    country: "laos",
    name: "Vientiane Lao",
    nativeName: "ພາສາລາວ (Phasa Lao)",
    description: "Standard Lao based on Vientiane dialect",
    flag: "🇱🇦",
    flagCode: "LA",
    speakers: "3.2 million native speakers",
    commonChallenges: [
      "Six-tone system interference",
      "Consonant cluster absence",
      "Vowel length distinctions",
      "Final consonant limitations"
    ],
    phoneticFeatures: [
      "Six lexical tones",
      "No consonant clusters",
      "Vowel length phonemic",
      "Limited syllable codas"
    ],
    tonalSystem: {
      hasTones: true,
      toneCount: 6,
      description: "Six tones create significant interference with English stress"
    },
    examples: {
      pronunciation: [
        "Producing consonant clusters",
        "Managing tone-stress conflicts",
        "Final consonant pronunciation"
      ],
      grammar: [
        "Classifier system to English articles",
        "Verb serialization patterns",
        "Time reference systems"
      ],
      vocabulary: [
        "Technical and academic vocabulary",
        "Abstract concept expression",
        "Formal language registers"
      ]
    },
    learningFocus: [
      "Consonant cluster training",
      "Stress-timed rhythm",
      "Intonation pattern practice"
    ]
  },

  // CAMBODIA
  {
    id: "khmer-phnom-penh",
    country: "cambodia",
    name: "Phnom Penh Khmer",
    nativeName: "ភាសាខ្មែរ (Phiesa Khmae)",
    description: "Standard Khmer based on Phnom Penh dialect",
    flag: "🇰🇭",
    flagCode: "KH",
    speakers: "16 million native speakers",
    commonChallenges: [
      "Non-tonal to tonal perception",
      "Consonant cluster complexity",
      "Vowel system differences",
      "Stress pattern variations"
    ],
    phoneticFeatures: [
      "Non-tonal language",
      "Complex consonant clusters",
      "Rich vowel system",
      "Register distinctions"
    ],
    tonalSystem: {
      hasTones: false,
      description: "Non-tonal but has register distinctions affecting vowel quality"
    },
    examples: {
      pronunciation: [
        "Simplifying consonant clusters",
        "Vowel quality distinctions",
        "Word stress patterns"
      ],
      grammar: [
        "Word order flexibility to fixed English order",
        "Verb aspect systems",
        "Classifier usage"
      ],
      vocabulary: [
        "Sanskrit/Pali loanword patterns",
        "Modern technical vocabulary",
        "Academic language development"
      ]
    },
    learningFocus: [
      "Consonant cluster reduction",
      "Stress pattern training",
      "Vowel quality practice"
    ]
  },
  // VIETNAM
  {
    id: "vietnamese-northern",
    country: "vietnam",
    name: "Northern Vietnamese (Hanoi)",
    nativeName: "Tiếng Việt Bắc",
    description: "Northern Vietnamese dialect from Hanoi",
    flag: "🇻🇳",
    flagCode: "VN",
    speakers: "25 million native speakers",
    commonChallenges: [
      "Six-tone system interference",
      "Consonant cluster absence",
      "Vowel system complexity",
      "Syllable-timed rhythm"
    ],
    phoneticFeatures: [
      "Six lexical tones",
      "No consonant clusters",
      "Complex vowel system",
      "Glottal stop endings"
    ],
    tonalSystem: {
      hasTones: true,
      toneCount: 6,
      description: "Six tones (level, rising, falling, low rising, high broken, low broken)"
    },
    examples: {
      pronunciation: [
        "Producing consonant clusters",
        "Managing tone-stress interference",
        "Final consonant clarity"
      ],
      grammar: [
        "Classifier to article systems",
        "Verb tense formation",
        "Question word placement"
      ],
      vocabulary: [
        "Chinese loanword patterns",
        "French loanword influence",
        "Technical vocabulary"
      ]
    },
    learningFocus: [
      "Consonant cluster training",
      "Stress-timed rhythm",
      "Intonation patterns"
    ]
  },
  {
    id: "vietnamese-southern",
    country: "vietnam",
    name: "Southern Vietnamese (Ho Chi Minh)",
    nativeName: "Tiếng Việt Nam",
    description: "Southern Vietnamese dialect from Ho Chi Minh City",
    flag: "🇻🇳",
    flagCode: "VN",
    speakers: "30 million native speakers",
    commonChallenges: [
      "Five-tone system (simplified)",
      "Different consonant mergers",
      "Vowel system variations",
      "Regional accent features"
    ],
    phoneticFeatures: [
      "Five tones (merged system)",
      "Consonant sound mergers",
      "Vowel system differences",
      "Faster speech tempo"
    ],
    tonalSystem: {
      hasTones: true,
      toneCount: 5,
      description: "Simplified five-tone system with merged patterns"
    },
    examples: {
      pronunciation: [
        "Managing simplified tone patterns",
        "Consonant distinction training",
        "Regional accent neutralization"
      ],
      grammar: [
        "Colloquial vs formal patterns",
        "Regional grammar variations",
        "Standard language registers"
      ],
      vocabulary: [
        "Regional vocabulary differences",
        "Business and technical terms",
        "International vocabulary"
      ]
    },
    learningFocus: [
      "Standard pronunciation training",
      "Formal register development",
      "Accent neutralization"
    ]
  },
  // GENERAL
  {
    id: "general",
    country: "other",
    name: "General English Learning",
    nativeName: "General",
    description: "Standard English pronunciation and grammar feedback",
    flag: "🌍",
    flagCode: "WORLD",
    speakers: "Global learners",
    commonChallenges: [
      "General pronunciation improvement",
      "Fluency development",
      "Grammar accuracy",
      "Vocabulary expansion"
    ],
    phoneticFeatures: [
      "Varied linguistic backgrounds",
      "General pronunciation patterns",
      "Standard learning approaches",
      "Universal challenges"
    ],
    examples: {
      pronunciation: [
        "Clear articulation",
        "Natural rhythm and intonation",
        "Confident speaking"
      ],
      grammar: [
        "Standard grammar patterns",
        "Common error correction",
        "Fluency development"
      ],
      vocabulary: [
        "Academic vocabulary",
        "Professional terminology",
        "Everyday communication"
      ]
    },
    learningFocus: [
      "General pronunciation improvement",
      "Fluency development",
      "Confidence building"
    ]
  }
];

export function getProfileById(id: LanguageDialectType): LanguageDialectProfile | undefined {
  return lancangMekongProfiles.find(profile => profile.id === id);
}

export function getProfilesByCountry(country: CountryType): LanguageDialectProfile[] {
  return lancangMekongProfiles.filter(profile => profile.country === country);
}

export function getAllCountries(): CountryType[] {
  return Array.from(new Set(lancangMekongProfiles.map(profile => profile.country)));
}

export function getLanguagesByCountry(country: CountryType): string[] {
  return Array.from(new Set(
    lancangMekongProfiles
      .filter(profile => profile.country === country)
      .map(profile => profile.name.split(' ')[0]) // Get primary language name
  ));
}

export function getFlagByCountry(country: CountryType): string {
  const profile = lancangMekongProfiles.find(p => p.country === country);
  return profile?.flag || "other";
}

export function getFlagCodeByDialect(dialectId: LanguageDialectType): string {
  const profile = getProfileById(dialectId);
  return profile?.flagCode || "WORLD";
}