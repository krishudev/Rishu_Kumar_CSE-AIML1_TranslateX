
'use client'; // This hook needs access to window object

import { useState, useEffect } from 'react';

/**
 * Custom hook to track the browser's online status.
 * Returns `true` if online, `false` if offline.
 */
export function useOnlineStatus(): boolean {
  // Initialize with the current status or assume online if window is not available (SSR)
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return; // Exit if window is not defined (e.g., during SSR)
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return isOnline;
}
