export interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  dialect?: DialectType;
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
  dialectSpecificFeedback?: string[];
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
  severity: 'low' | 'medium' | 'high';
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
  complexity: 'basic' | 'intermediate' | 'advanced';
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
  theme: 'light' | 'dark' | 'system';
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

export type DialectType = 
  | 'thai-english'
  | 'vietnamese-english' 
  | 'chinese-english'
  | 'general';

export type AchievementType = 
  | 'first-recording'
  | 'daily-streak'
  | 'weekly-goal'
  | 'pronunciation-master'
  | 'fluency-improver'
  | 'grammar-guru'
  | 'vocabulary-builder'
  | 'consistency-champion';

export type AchievementCategory = 
  | 'getting-started'
  | 'consistency'
  | 'skill-improvement'
  | 'milestones';

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
    trend: 'improving' | 'stable' | 'declining';
  };
  fluency: {
    current: number;
    previous: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  grammar: {
    current: number;
    previous: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  vocabulary: {
    current: number;
    previous: number;
    trend: 'improving' | 'stable' | 'declining';
  };
}