
export type Language = {
  value: string; // e.g., 'en'
  label: string; // e.g., 'English'
  nativeLabel?: string; // e.g., 'English' or 'Español'
};

// Expanded list for better mobile app coverage (add more as needed)
export const supportedLanguages: Language[] = [
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { value: 'fr', label: 'French', nativeLabel: 'Français' },
  { value: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { value: 'it', label: 'Italian', nativeLabel: 'Italiano' },
  { value: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { value: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { value: 'ko', label: 'Korean', nativeLabel: '한국어' },
  { value: 'zh', label: 'Chinese', nativeLabel: '中文' }, // Simplified Chinese often uses 'zh' or 'zh-CN'
  { value: 'ru', label: 'Russian', nativeLabel: 'Русский' },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { value: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { value: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { value: 'nl', label: 'Dutch', nativeLabel: 'Nederlands' },
  { value: 'sv', label: 'Swedish', nativeLabel: 'Svenska' },
  { value: 'tr', label: 'Turkish', nativeLabel: 'Türkçe' },
  { value: 'vi', label: 'Vietnamese', nativeLabel: 'Tiếng Việt' },
  { value: 'pl', label: 'Polish', nativeLabel: 'Polski' },
  { value: 'id', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia' },
  { value: 'th', label: 'Thai', nativeLabel: 'ไทย' },
  // Add other desired languages here
];


export const defaultSourceLanguage = "en";
export const defaultTargetLanguage = "es"; // Default to Spanish


// Helper function to get a language object by its value
export const getLanguageByValue = (value: string): Language | undefined => {
  // Handle potential regional codes like 'zh-CN' by checking the base code
  const baseValue = value.split('-')[0];
  return supportedLanguages.find(lang => lang.value === value || lang.value === baseValue);
}
