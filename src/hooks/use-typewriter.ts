
'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to simulate a typewriter effect.
 * @param text The full text to type out.
 * @param speed The typing speed in milliseconds per character.
 * @returns The currently typed portion of the text.
 */
export function useTypewriter(text: string, speed: number = 50): string {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset when the target text changes
    indexRef.current = 0;
    setDisplayedText(''); // Clear displayed text immediately

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Start typing if text is not empty
    if (text.length > 0) {
        const typeCharacter = () => {
            if (indexRef.current < text.length) {
              setDisplayedText((prev) => prev + text.charAt(indexRef.current));
              indexRef.current += 1;
              timeoutRef.current = setTimeout(typeCharacter, speed);
            } else {
                 timeoutRef.current = null; // Typing finished
            }
          };
         // Initial call with a slight delay to ensure state reset is processed
         timeoutRef.current = setTimeout(typeCharacter, speed);
    }


    // Cleanup function to clear timeout on unmount or text change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [text, speed]); // Rerun effect if text or speed changes

  return displayedText;
}
