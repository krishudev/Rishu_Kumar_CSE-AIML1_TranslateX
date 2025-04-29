

// Defines shared TypeScript types used across the application.

export interface TranslationEntry {
  id: string; // Unique identifier (e.g., Firestore document ID)
  sourceLanguage: string; // Display label, e.g., 'English'
  targetLanguage: string; // Display label, e.g., 'Español'
  sourceText: string;
  targetText: string;
  timestamp: number; // Unix timestamp (ms)
  isFavorite: boolean;
  sourceLanguageCode?: string; // Optional: code like 'en'
  targetLanguageCode?: string; // Optional: code like 'es'
}
