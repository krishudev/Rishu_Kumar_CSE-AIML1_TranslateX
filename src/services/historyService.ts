
// This file contains functions for interacting with translation history data using localStorage.

import type { TranslationEntry } from '@/lib/types';
import { getLanguageByValue } from '@/lib/languages'; // Import to potentially get codes if needed

const HISTORY_STORAGE_KEY = 'translationHistory';
const MAX_HISTORY_ITEMS = 50; // Limit the number of stored history items

/**
 * Fetches translation history from localStorage.
 */
export async function fetchHistory(): Promise<TranslationEntry[]> {
  // console.log('Fetching history from localStorage...'); // Reduced logging
  if (typeof window === 'undefined' || !window.localStorage) {
    return []; // Return empty if localStorage is unavailable
  }

  try {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (storedHistory) {
      const history = JSON.parse(storedHistory) as TranslationEntry[];
      // Ensure entries have all required fields and sort by timestamp descending
      return history
        .filter(entry => entry.id && entry.timestamp && entry.sourceLanguage && entry.targetLanguage && entry.sourceText && entry.targetText) // More robust validation
        .sort((a, b) => b.timestamp - a.timestamp);
    }
  } catch (error) {
    console.error('Error reading history from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }

  return []; // Return empty array if no history or error
}

/**
 * Adds a new translation entry to history in localStorage.
 * Expects an object containing source/target language labels, text, and optional codes.
 */
export async function addHistoryEntry(entryData: Omit<TranslationEntry, 'id' | 'timestamp' | 'isFavorite'>): Promise<string> {
    // console.log('Adding history entry to localStorage:', entryData); // Reduced logging
    if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('LocalStorage not available, history not saved.');
        return ''; // Indicate failure or handle differently
    }

    const newId = crypto.randomUUID();
    const newEntry: TranslationEntry = {
      // Ensure codes are included if passed
      sourceLanguageCode: entryData.sourceLanguageCode || getLanguageByValue(entryData.sourceLanguage)?.value,
      targetLanguageCode: entryData.targetLanguageCode || getLanguageByValue(entryData.targetLanguage)?.value,
      ...entryData, // Includes sourceLanguage, targetLanguage, sourceText, targetText
      id: newId,
      timestamp: Date.now(),
      isFavorite: false,
    };

    // Basic validation before saving
    if (!newEntry.sourceLanguage || !newEntry.targetLanguage || !newEntry.sourceText || !newEntry.targetText) {
        console.error("Attempted to add invalid history entry:", newEntry);
        return ''; // Indicate failure
    }


    try {
        let currentHistory = await fetchHistory(); // Fetch existing history
        // Add new entry to the beginning
        currentHistory.unshift(newEntry);
        // Limit the history size
        if (currentHistory.length > MAX_HISTORY_ITEMS) {
            currentHistory = currentHistory.slice(0, MAX_HISTORY_ITEMS);
        }
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(currentHistory));
        // console.log('Saved updated history to localStorage.'); // Reduced logging
        return newId;
    } catch (error) {
        console.error('Error saving history to localStorage:', error);
        // Consider more robust error handling / UI feedback
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
             console.warn('LocalStorage quota exceeded. Attempting to clean up old history.');
             try {
                 let currentHistory = await fetchHistory();
                 if (currentHistory.length > MAX_HISTORY_ITEMS / 2) { // Remove older half
                     currentHistory = currentHistory.slice(0, Math.floor(MAX_HISTORY_ITEMS / 2));
                     currentHistory.unshift(newEntry); // Add the new one again
                     localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(currentHistory));
                     console.log('Cleaned up history and saved new entry.');
                     return newId;
                 }
             } catch (cleanupError) {
                 console.error('Error during history cleanup:', cleanupError);
             }
        }
        return ''; // Indicate failure
    }
}


/**
 * Toggles the favorite status of a history entry in localStorage.
 * @param id The ID of the translation entry to update.
 */
export async function toggleFavorite(id: string): Promise<void> {
  // console.log('Toggling favorite status in localStorage for ID:', id); // Reduced logging
   if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('LocalStorage not available, favorite not toggled.');
        return;
    }

  try {
      let currentHistory = await fetchHistory(); // Fetch existing history
      let updated = false;
      const updatedHistory = currentHistory.map(item => {
          if (item.id === id) {
              updated = true;
              return { ...item, isFavorite: !item.isFavorite };
          }
          return item;
      });

      if (updated) {
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
          // console.log('Successfully toggled favorite in localStorage for ID:', id); // Reduced logging
      } else {
           console.warn('History item not found for toggling favorite:', id);
      }

  } catch (error) {
      console.error('Error toggling favorite in localStorage:', error);
       // Consider more robust error handling / UI feedback
  }
}

/**
 * Clears all translation history from localStorage.
 */
export async function clearHistory(): Promise<void> {
    console.log('Clearing all translation history from localStorage...');
    if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('LocalStorage not available, history not cleared.');
        return;
    }

    try {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
        console.log('Translation history cleared.');
    } catch (error) {
        console.error('Error clearing history from localStorage:', error);
    }
}
