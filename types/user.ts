export interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  country?: CountryType;
  primaryLanguage?: string;
  languageDialect?: LanguageDialectType;
  createdAt: Date;
  updatedAt: Date;
  recordingHistory: RecordingHistory[];
  achievements: Achievement[];
  preferences: UserPreferences;
}

export interface RecordingHistory {
  id: string;
  userId: string;
  audioUrl: string;
  transcription: string;
  analysisResult: AnalysisResult;
  createdAt: Date;
  topic?: string;
  duration: number;
  fileSize: number;
}

export interface AnalysisResult {
  overallScore: number;
  pronunciation: PronunciationAnalysis;
  fluency: FluencyAnalysis;
  grammar: GrammarAnalysis;
  vocabulary: VocabularyAnalysis;
  improvements: string[];
  strengths: string[];
  languageDialectSpecificFeedback?: string[];
}

export interface PronunciationAnalysis {
  score: number;
  issues: PronunciationIssue[];
  improvements: string[];
}

export interface PronunciationIssue {
  word: string;
  timestamp: number;
  issue: string;
  suggestion: string;
  severity: "low" | "medium" | "high";
}

export interface FluencyAnalysis {
  score: number;
  wordsPerMinute: number;
  pauseAnalysis: {
    totalPauses: number;
    averagePauseLength: number;
    longPauses: number;
  };
  fillerWords: {
    count: number;
    words: string[];
  };
}

export interface GrammarAnalysis {
  score: number;
  errors: GrammarError[];
  suggestions: string[];
}

export interface GrammarError {
  text: string;
  position: number;
  type: string;
  suggestion: string;
}

export interface VocabularyAnalysis {
  score: number;
  complexity: "basic" | "intermediate" | "advanced";
  uniqueWords: number;
  totalWords: number;
  suggestions: string[];
}

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  unlockedAt: Date;
  progress: number;
  maxProgress: number;
  category: AchievementCategory;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    achievements: boolean;
    weeklyProgress: boolean;
  };
  privacy: {
    shareProgress: boolean;
    allowAnalytics: boolean;
  };
}

export type LanguageDialectType =
  // China
  | "mandarin-standard"
  | "mandarin-beijing"
  | "mandarin-northeastern"
  | "cantonese-hongkong"
  | "cantonese-guangzhou"
  | "wu-shanghai"
  | "min-fujian"
  | "hakka-taiwan"
  // Myanmar
  | "burmese-standard"
  | "burmese-yangon"
  | "burmese-mandalay"
  | "shan-northern"
  | "karen-sgaw"
  // Laos
  | "lao-vientiane"
  | "lao-luang-prabang"
  | "lao-southern"
  | "hmong-white"
  | "khmu-northern"
  // Thailand
  | "thai-central"
  | "thai-northern"
  | "thai-northeastern"
  | "thai-southern"
  // Cambodia
  | "khmer-phnom-penh"
  | "khmer-battambang"
  | "khmer-siem-reap"
  // Vietnam
  | "vietnamese-northern"
  | "vietnamese-central"
  | "vietnamese-southern"
  // General
  | "general";

export type CountryType =
  | "china"
  | "myanmar"
  | "laos"
  | "thailand"
  | "cambodia"
  | "vietnam"
  | "other";

export type AchievementType =
  | "first-recording"
  | "daily-streak"
  | "weekly-goal"
  | "pronunciation-master"
  | "fluency-improver"
  | "grammar-guru"
  | "vocabulary-builder"
  | "consistency-champion";

export type AchievementCategory =
  | "getting-started"
  | "consistency"
  | "skill-improvement"
  | "milestones";

// Utility types for API responses
export interface UserStats {
  totalRecordings: number;
  totalPracticeTime: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  improvementRate: number;
  lastRecordingDate?: Date;
}

export interface ProgressMetrics {
  pronunciation: {
    current: number;
    previous: number;
    trend: "improving" | "stable" | "declining";
  };
  fluency: {
    current: number;
    previous: number;
    trend: "improving" | "stable" | "declining";
  };
  grammar: {
    current: number;
    previous: number;
    trend: "improving" | "stable" | "declining";
  };
  vocabulary: {
    current: number;
    previous: number;
    trend: "improving" | "stable" | "declining";
  };
}

export interface VoiceRecording {
  id: string;
  userId: string;
  blobUrl: string;
  blobPathname: string;
  transcript: string | null;
  duration: number;
  languageDialect: string | null;
  createdAt: Date;
  updatedAt: Date;
  feedback: VoiceRecordingFeedback | null;
}

export interface VoiceRecordingFeedback {
  id: string;
  recordingId: string;
  pronunciation: string;
  grammar: string;
  fluency: string;
  vocabulary: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChartDataPoint {
  session: number;
  pronunciation: number;
  grammar: number;
  fluency: number;
  vocabulary: number;
  date: string;
}

export interface AverageScores {
  pronunciation: number;
  grammar: number;
  fluency: number;
  vocabulary: number;
}

export interface DashboardResponse {
  totalSessions: number;
  totalPracticeTime: number;
  averageScores: AverageScores;
  improvementRate: string;
  chartData: ChartDataPoint[];
  hasData: boolean;
}
