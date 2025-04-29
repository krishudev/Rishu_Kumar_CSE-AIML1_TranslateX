
'use client';

import { useState, useTransition, useCallback, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { ArrowLeftRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TranslationPanel } from '@/components/translation-panel';
import { LanguageSelectorSheet } from '@/components/language-selector-sheet';
import { initialTranslation } from '@/ai/flows/initial-translation';
import { addHistoryEntry } from '@/services/historyService'; // Import history service function
import {
  supportedLanguages,
  defaultSourceLanguage,
  defaultTargetLanguage,
  getLanguageByValue, // Import getLanguageByValue
} from '@/lib/languages';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { useOnlineStatus } from '@/hooks/use-online-status'; // Import online status hook
import { getCachedTranslation, cacheTranslation } from '@/services/cacheService'; // Import cache functions
// import { useTypewriter } from '@/hooks/use-typewriter'; // Remove typewriter hook

// Extend window type for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    // Add custom event listener type
    addEventListener(type: 'fabTranslateTrigger', listener: (this: Window, ev: CustomEvent) => any, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: 'fabTranslateTrigger', listener: (this: Window, ev: CustomEvent) => any, options?: boolean | EventListenerOptions): void;
  }
}

export function Translator() {
  const [sourceLanguage, setSourceLanguage] = useState(defaultSourceLanguage);
  const [targetLanguage, setTargetLanguage] = useState(defaultTargetLanguage);
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState(''); // Use state directly, no typewriter
  const [isTranslating, startTranslation] = useTransition();
  const [isSourceSheetOpen, setIsSourceSheetOpen] = useState(false);
  const [isTargetSheetOpen, setIsTargetSheetOpen] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for debounce timeout
  const isOnline = useOnlineStatus(); // Get online status
  const [offlineModeEnabled, setOfflineModeEnabled] = useState<boolean>(false);

  // Load offline mode setting from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('offlineModeEnabled') === 'true';
      setOfflineModeEnabled(storedValue);

      const handleStorageChange = (event: StorageEvent) => {
         if (event.key === 'offlineModeEnabled') {
           setOfflineModeEnabled(event.newValue === 'true');
         }
       };
       window.addEventListener('storage', handleStorageChange);
       return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);


   // Show offline notification snackbar (teal color)
   useEffect(() => {
    if (!isOnline) {
      toast({
        title: 'Offline Mode Active',
        description: offlineModeEnabled
          ? 'Using cached translations where possible.'
          : 'Translation might not work. Enable offline mode in settings.',
        // Use accent color for snackbar via theme variable
        className: 'bg-notification text-notification-foreground border-transparent',
        variant: offlineModeEnabled ? 'default' : 'destructive',
        duration: 5000,
      });
    }
  }, [isOnline, offlineModeEnabled, toast]);

  // Define the translation logic
  const triggerTranslation = useCallback(() => {
    handleTranslate(sourceText, sourceLanguage, targetLanguage);
  }, [sourceText, sourceLanguage, targetLanguage]); // Add dependencies if handleTranslate needs them directly

  // Add event listener for FAB click
  useEffect(() => {
    const handleFabClick = () => {
        console.log('FAB translate event received');
        triggerTranslation();
    };

    window.addEventListener('fabTranslateTrigger', handleFabClick);

    return () => {
      window.removeEventListener('fabTranslateTrigger', handleFabClick);
    };
  }, [triggerTranslation]); // Re-attach listener if triggerTranslation changes


  const handleTranslate = useCallback(async (currentSourceText: string, currentSourceLang: string, currentTargetLang: string) => {
    const trimmedSourceText = currentSourceText.trim();
    if (!trimmedSourceText) {
      setTranslatedText('');
      return;
    }
    if (currentSourceLang === currentTargetLang) {
      setTranslatedText(trimmedSourceText);
      return;
    }

    // Check cache first, especially if offline or offline mode enabled
    if (!isOnline && offlineModeEnabled) {
      const cached = getCachedTranslation(trimmedSourceText, currentSourceLang, currentTargetLang);
      if (cached) {
        setTranslatedText(cached);
        console.log("Used cached translation (offline).");
        return;
      } else {
         setTranslatedText('');
         console.log("Offline and no cached translation found.");
         return;
      }
    }

    // Also check cache even if online (optional optimization)
    if (offlineModeEnabled) {
         const cached = getCachedTranslation(trimmedSourceText, currentSourceLang, currentTargetLang);
         if (cached) {
           setTranslatedText(cached);
           console.log("Used cached translation (online).");
           return; // Exit if cache hit and offline mode is on
         }
     }


    // If online or offline mode disabled (and online), proceed with API call
    if (isOnline) {
      startTranslation(async () => {
        try {
          const result = await initialTranslation({
            text: trimmedSourceText,
            sourceLanguage: currentSourceLang,
            targetLanguage: currentTargetLang,
          });
          setTranslatedText(result.translatedText);

          // Cache the successful translation if offline mode is enabled
          if (offlineModeEnabled) {
             cacheTranslation(trimmedSourceText, currentSourceLang, currentTargetLang, result.translatedText);
          }


          // Add to history after successful translation
           const sourceLangLabel = getLanguageByValue(currentSourceLang)?.label || currentSourceLang;
           const targetLangLabel = getLanguageByValue(currentTargetLang)?.label || currentTargetLang;

           // Ensure required fields are present before adding to history
           if (sourceLangLabel && targetLangLabel && trimmedSourceText && result.translatedText) {
                 await addHistoryEntry({
                   sourceLanguage: sourceLangLabel,
                   targetLanguage: targetLangLabel,
                   sourceText: trimmedSourceText,
                   targetText: result.translatedText,
                   sourceLanguageCode: currentSourceLang,
                   targetLanguageCode: currentTargetLang,
                 });
           } else {
               console.warn("Skipping history entry due to missing data.");
           }


        } catch (error) {
          console.error('Translation error:', error);
          toast({
            title: 'Translation Error',
            description: 'Failed to translate the text. Please try again.',
            variant: 'destructive',
          });
          setTranslatedText('');
        }
      });
    } else {
         // If offline and offline mode is disabled, clear translation
         setTranslatedText('');
         console.log("Offline and offline mode disabled. Cannot translate.");
     }
  }, [startTranslation, toast, isOnline, offlineModeEnabled, addHistoryEntry]); // Added addHistoryEntry

  // Debounced translation effect using ref to manage timeout
  useEffect(() => {
    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current);
    }

    if (sourceText.trim()) {
      translationTimeoutRef.current = setTimeout(() => {
        handleTranslate(sourceText, sourceLanguage, targetLanguage);
      }, 500); // 500ms debounce
    } else {
      setTranslatedText('');
    }

    return () => {
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
    };
  }, [sourceText, sourceLanguage, targetLanguage, handleTranslate]);

  const handleSourceTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(e.target.value);
  };

   const handleSwapLanguages = () => {
    if (isTranslating || isRecording || (!isOnline && !offlineModeEnabled)) return;

    setIsSwapping(true);
    const currentSourceText = sourceText;
    const currentTranslatedText = translatedText; // Use direct state
    const currentSourceLang = sourceLanguage;
    const currentTargetLang = targetLanguage;

    if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
    }
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }

    setSourceLanguage(currentTargetLang);
    setTargetLanguage(currentSourceLang);
    setSourceText(currentTranslatedText || ''); // Use previous translation as new source

    setTimeout(() => setIsSwapping(false), 300);
  };

  const handleClearText = () => {
    setSourceText('');
    setTranslatedText('');
     if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
     if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
  };

  const handleCopyToClipboard = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText).then(() => {
      toast({
        title: 'Copied!',
        description: 'Translated text copied to clipboard.',
        // Use accent color for snackbar
        className: 'bg-notification text-notification-foreground border-transparent',
      });
    }).catch(err => {
        console.error('Failed to copy text: ', err);
         toast({
          title: 'Copy Failed',
          description: 'Could not copy text to clipboard.',
          variant: 'destructive',
        });
    });
  };

   // --- Voice Input (Speech-to-Text) ---
   const handleToggleRecording = () => {
      if (!isOnline) {
         toast({ title: 'Offline', description: 'Voice input requires an internet connection.', variant: 'destructive' });
         return;
      }
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast({ title: 'Error', description: 'Speech recognition not supported in this browser.', variant: 'destructive' });
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionAPI();
    recognitionRef.current.lang = sourceLanguage;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = false;

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      setSourceText('');
      setTranslatedText('');
       toast({ title: 'Listening...', description: 'Speak into your microphone.' });
    };

    let finalTranscriptAccumulator = '';

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      finalTranscriptAccumulator = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptAccumulator += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
       setSourceText(finalTranscriptAccumulator || interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = 'An unknown error occurred during speech recognition.';
       if (event.error === 'no-speech') {
         errorMessage = 'No speech detected. Please try again.';
       } else if (event.error === 'audio-capture') {
         errorMessage = 'Microphone error. Check permissions and hardware.';
       } else if (event.error === 'not-allowed') {
         errorMessage = 'Permission denied. Please allow microphone access.';
       } else if (event.error === 'network') {
          errorMessage = 'Network error during speech recognition.';
       }
      toast({ title: 'Speech Recognition Error', description: errorMessage, variant: 'destructive' });
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      // Translation will be triggered by the useEffect watching sourceText
    };

    recognitionRef.current.start();
  };

  // --- Text-to-Speech ---
  const handleSpeakTranslation = () => {
      if (!isOnline) {
         toast({ title: 'Offline', description: 'Text-to-speech requires an internet connection.', variant: 'destructive' });
         return;
      }
     if (!('speechSynthesis' in window)) {
      toast({ title: 'Error', description: 'Text-to-speech not supported in this browser.', variant: 'destructive' });
      return;
    }
    if (!translatedText || isTranslating) return;

    speechSynthesis.cancel();
     if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
        setIsRecording(false);
     }


    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLanguage;

     const loadVoicesAndSpeak = () => {
         const voices = speechSynthesis.getVoices();
          if (voices.length === 0) {
              speechSynthesis.onvoiceschanged = () => {
                  const updatedVoices = speechSynthesis.getVoices();
                  const voice = updatedVoices.find(v => v.lang.startsWith(targetLanguage));
                  if (voice) utterance.voice = voice;
                   try {
                        speechSynthesis.speak(utterance);
                    } catch (e) {
                         console.error("Speech synthesis error:", e);
                         toast({ title: 'Speech Error', description: 'Could not play audio.', variant: 'destructive' });
                    }
                   speechSynthesis.onvoiceschanged = null;
              };
          } else {
              const voice = voices.find(v => v.lang.startsWith(targetLanguage));
              if (voice) utterance.voice = voice;
              try {
                    speechSynthesis.speak(utterance);
                } catch (e) {
                     console.error("Speech synthesis error:", e);
                     toast({ title: 'Speech Error', description: 'Could not play audio.', variant: 'destructive' });
                }
          }
     }

     if (speechSynthesis.getVoices().length > 0) {
         loadVoicesAndSpeak();
     } else {
         speechSynthesis.onvoiceschanged = loadVoicesAndSpeak;
     }

     toast({ title: 'Speaking', description: 'Playing translated text...' });
  };


  const availableLanguages = supportedLanguages;
  const isEffectivelyOffline = !isOnline && !offlineModeEnabled;


  return (
    <>
      {/* Use flex-col for mobile stacking, md:flex-row for larger screens */}
      <div className={cn(
          "container mx-auto flex max-w-5xl flex-grow flex-col p-4 md:p-6", // Adjusted padding
          "animate-fade-in" // Add fade-in animation
      )}>
         {/* Grid for vertical stacking on mobile, horizontal on desktop */}
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
          {/* Source Panel */}
          <TranslationPanel
            id="source-text-area"
            type="source"
            language={sourceLanguage}
            onLanguageChange={setSourceLanguage}
            onLanguageSelectClick={() => setIsSourceSheetOpen(true)}
            languages={availableLanguages}
            text={sourceText}
            onTextChange={handleSourceTextChange}
            placeholder={isRecording ? "Listening..." : "Enter text or use mic"}
            onClear={handleClearText}
            onStartRecording={handleToggleRecording}
            isRecording={isRecording}
            disabled={isEffectivelyOffline || isRecording}
            aria-labelledby="source-language-label"
          />

          {/* Swap Button (Hidden on mobile, shown on md+) */}
          <div className="hidden md:flex items-center justify-center swap-button-container">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwapLanguages}
              aria-label="Swap languages"
              className={cn(
                "h-12 w-12 text-accent hover:bg-accent/10 dark:hover:bg-accent/20", // Standard touch target size
                "transition-transform duration-300 ease-in-out",
                 "hover:scale-110 active:scale-100", // Simpler animation
                 isSwapping ? 'rotate-180' : 'rotate-0'
              )}
               disabled={isSwapping || isRecording || isTranslating || isEffectivelyOffline}
            >
              <ArrowLeftRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Target Panel */}
          <TranslationPanel
            id="target-text-area"
            type="target"
            language={targetLanguage}
            onLanguageChange={setTargetLanguage}
            onLanguageSelectClick={() => setIsTargetSheetOpen(true)}
            languages={availableLanguages}
            text={translatedText} // Use direct state
            isLoading={isTranslating && isOnline}
            placeholder={isTranslating && isOnline ? '' : (isEffectivelyOffline ? 'Offline' : 'Translation')} // Empty placeholder while loading
            onCopy={handleCopyToClipboard}
            onSpeakTranslation={handleSpeakTranslation}
            disabled={isEffectivelyOffline}
            aria-labelledby="target-language-label"
          />
        </div>
      </div>
      <Toaster />

      {/* Source Language Selector Sheet */}
      <LanguageSelectorSheet
        open={isSourceSheetOpen}
        onOpenChange={setIsSourceSheetOpen}
        languages={availableLanguages}
        selectedLanguage={sourceLanguage}
        onSelectLanguage={(lang) => {
            setSourceLanguage(lang);
            if (recognitionRef.current && isRecording) {
                recognitionRef.current.stop();
                setIsRecording(false);
            }
             if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
            }
        }}
        title="Select Source Language"
      />

      {/* Target Language Selector Sheet */}
      <LanguageSelectorSheet
        open={isTargetSheetOpen}
        onOpenChange={setIsTargetSheetOpen}
        languages={availableLanguages}
        selectedLanguage={targetLanguage}
        onSelectLanguage={(lang) => {
            setTargetLanguage(lang);
            if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
            }
        }}
        title="Select Target Language"
      />
    </>
  );
}
