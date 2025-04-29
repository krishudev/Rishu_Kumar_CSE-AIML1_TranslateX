
// src/services/cacheService.ts

/**
 * Simple caching service using localStorage for offline translations.
 * Note: localStorage has size limits (usually 5-10MB).
 * For more robust caching, consider IndexedDB.
 */

const CACHE_PREFIX = 'translationCache_';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // Cache for 7 days

interface CachedTranslation {
  targetText: string;
  timestamp: number;
}

/**
 * Generates a unique key for caching based on text and language pair.
 */
function generateCacheKey(sourceText: string, sourceLang: string, targetLang: string): string {
  // Simple hash function (consider a more robust one like SHA-1 if needed, but requires crypto library)
  const hash = sourceText.split('').reduce((acc, char) => {
    acc = ((acc << 5) - acc) + char.charCodeAt(0);
    return acc & acc; // Convert to 32bit integer
  }, 0);
  return `${CACHE_PREFIX}${sourceLang}_${targetLang}_${Math.abs(hash)}`; // Use absolute value for hash
}

/**
 * Caches a translation result in localStorage.
 */
export function cacheTranslation(
  sourceText: string,
  sourceLang: string,
  targetLang: string,
  targetText: string
): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return; // Don't cache if localStorage is unavailable
  }

  const key = generateCacheKey(sourceText, sourceLang, targetLang);
  const data: CachedTranslation = {
    targetText,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(data));
    // console.log(`Cached translation for key: ${key}`);
    // Optional: Implement LRU or size limit cleanup here if needed
    cleanupOldCacheEntries();
  } catch (error) {
    console.error('Error saving to localStorage (cache might be full):', error);
    // Optionally try cleaning up older entries and retrying
    cleanupOldCacheEntries(true); // Force cleanup
    try {
        localStorage.setItem(key, JSON.stringify(data)); // Retry
    } catch (retryError) {
        console.error('Retry failed. Could not cache translation:', retryError);
    }
  }
}

/**
 * Retrieves a cached translation from localStorage if it exists and hasn't expired.
 */
export function getCachedTranslation(
  sourceText: string,
  sourceLang: string,
  targetLang: string
): string | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null; // No cache if localStorage is unavailable
  }

  const key = generateCacheKey(sourceText, sourceLang, targetLang);
  const cachedItem = localStorage.getItem(key);

  if (cachedItem) {
    try {
      const data: CachedTranslation = JSON.parse(cachedItem);
      const now = Date.now();

      // Check if the cache entry has expired
      if (now - data.timestamp < CACHE_EXPIRY_MS) {
        // console.log(`Cache hit for key: ${key}`);
        return data.targetText;
      } else {
        // console.log(`Cache expired for key: ${key}`);
        localStorage.removeItem(key); // Remove expired entry
      }
    } catch (error) {
      console.error('Error parsing cached item:', error);
      localStorage.removeItem(key); // Remove corrupted entry
    }
  }

  // console.log(`Cache miss for key: ${key}`);
  return null;
}

/**
 * Cleans up old cache entries to manage localStorage space.
 * @param force - If true, runs cleanup even if not strictly necessary based on time.
 */
function cleanupOldCacheEntries(force: boolean = false): void {
   if (typeof window === 'undefined' || !window.localStorage) {
     return;
   }
    // Simple time-based cleanup check to avoid running too often
   const lastCleanup = parseInt(localStorage.getItem(`${CACHE_PREFIX}lastCleanup`) || '0', 10);
   const now = Date.now();
   if (!force && now - lastCleanup < 60 * 60 * 1000) { // Run max once per hour unless forced
        return;
   }


   let removedCount = 0;
   // console.log('Running cache cleanup...');
   for (let i = 0; i < localStorage.length; i++) {
     const key = localStorage.key(i);
     if (key && key.startsWith(CACHE_PREFIX) && key !== `${CACHE_PREFIX}lastCleanup`) {
       const cachedItem = localStorage.getItem(key);
       if (cachedItem) {
         try {
           const data: CachedTranslation = JSON.parse(cachedItem);
           if (now - data.timestamp >= CACHE_EXPIRY_MS) {
             localStorage.removeItem(key);
             removedCount++;
             i--; // Adjust index since item was removed
           }
         } catch (error) {
           // Corrupted item, remove it
           localStorage.removeItem(key);
           removedCount++;
           i--;
         }
       }
     }
   }
   localStorage.setItem(`${CACHE_PREFIX}lastCleanup`, String(now));
  //  if (removedCount > 0) {
  //      console.log(`Cache cleanup removed ${removedCount} expired entries.`);
  //  }
 }

 // Run cleanup once when the module loads initially
 // cleanupOldCacheEntries(); // Removed initial call to avoid potential SSR issues

