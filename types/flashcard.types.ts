export enum Level {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED"
}

export enum WordCategory {
  NOUN = "NOUN",
  VERB = "VERB",
  ADJECTIVE = "ADJECTIVE",
  ADVERB = "ADVERB",
  OTHER = "OTHER"
}

export interface Vocabulary {
  id: string;
  word: string;
  pronunciation?: string;
  meaning?: string;
  example?: string;
  exampleTranslation?: string;
  category?: WordCategory;
  level?: Level;
  topic?: string;
  createdAt?: string;
}

export interface VocabularyTopic {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  icon?: string;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  vocabularyCount?: number;
  level?: Level;
  vocabularies?: Vocabulary[];
  createdAt?: string;
}

export interface VocabularyDTO {
  word: string;
  pronunciation?: string;
  meaning?: string;
  example?: string;
  exampleTranslation?: string;
  category?: WordCategory;
  level?: Level;
}

export interface VocabularyTopicDTO {
  name: string;
  nameEn?: string;
  description?: string;
  icon?: string;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  level?: Level;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

