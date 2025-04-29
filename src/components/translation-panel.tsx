
import type * as React from 'react';
import { Languages, Copy, X, ChevronDown, Mic, Volume2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Language } from '@/lib/languages';
import { getLanguageByValue } from '@/lib/languages'; // Import helper
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TranslationPanelProps {
  type: 'source' | 'target';
  language: string;
  onLanguageChange: (value: string) => void; // For sheet callback
  onLanguageSelectClick: () => void; // Function to open the sheet
  languages: Language[]; // Keep for display/validation
  text: string;
  onTextChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading?: boolean;
  placeholder: string;
  onClear?: () => void;
  onCopy?: () => void;
  onStartRecording?: () => void; // Handler for starting voice input
  onSpeakTranslation?: () => void; // Handler for speaking translation
  isRecording?: boolean; // State for recording activity
  id: string;
  'aria-labelledby': string;
  disabled?: boolean; // Add disabled prop for offline state
}

export function TranslationPanel({
  type,
  language,
  onLanguageChange,
  onLanguageSelectClick,
  languages,
  text,
  onTextChange,
  isLoading,
  placeholder,
  onClear,
  onCopy,
  onStartRecording,
  onSpeakTranslation,
  isRecording,
  id,
  'aria-labelledby': labelledby,
  disabled = false,
}: TranslationPanelProps) {
  const showClearButton = type === 'source' && text.length > 0 && !isRecording && !disabled;
  const showCopyButton = type === 'target' && text.length > 0 && !isLoading && !disabled;
  const showMicButton = type === 'source' && !!onStartRecording && !disabled;
  const showSpeakerButton = type === 'target' && text.length > 0 && !isLoading && !!onSpeakTranslation && !disabled;

  const selectedLanguageObject = getLanguageByValue(language);
  const displayLanguageLabel = selectedLanguageObject
    ? selectedLanguageObject.label
    : 'Select Language';

  // Use shimmer effect for loading state in target panel
  const isEffectivelyLoading = isLoading && !disabled && type === 'target';

  return (
    // Apply card styling from globals.css (rounded-xl, shadow-md, etc.)
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden transition-all duration-300",
        "translation-card", // Applies bg-card, text-card-foreground, rounded-xl, shadow-md, border
        disabled && "opacity-60 pointer-events-none", // Styles when disabled
        // Focus state managed by :focus-within in globals.css
      )}
      aria-labelledby={labelledby}
      aria-disabled={disabled}
      data-loading={isEffectivelyLoading} // For potential CSS targeting
    >
      {/* Card Header: Language selector and Mic/Clear buttons */}
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 p-3 bg-card">
        {/* Language Selection Button */}
        <div className="flex items-center space-x-1 flex-wrap">
          <Button
            variant="ghost"
            onClick={onLanguageSelectClick}
            className={cn(
                "w-auto p-1 text-sm font-medium shadow-none focus:ring-0 focus:ring-offset-0",
                "text-card-foreground hover:text-accent dark:hover:text-accent", // Use accent for hover
                "flex items-center gap-1 transition-transform duration-200 hover:scale-105 active:scale-100" // Simpler animation
            )}
            aria-haspopup="dialog"
            aria-label={`${type === 'source' ? 'Source' : 'Target'} language: ${displayLanguageLabel}. Click to change.`}
            disabled={disabled} // Disable button when offline
            style={{ minHeight: '48px' }} // Ensure min touch target size
          >
             {/* Use text-lg (18sp equivalent) */}
            <span className="font-sans text-lg">{displayLanguageLabel}</span>
            <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
          </Button>
        </div>

        {/* Action Buttons (Mic/Clear) */}
        <div className="flex items-center space-x-1">
          {showMicButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onStartRecording}
                    aria-label={isRecording ? "Stop recording" : "Start voice input"}
                    className={cn(
                      "h-12 w-12 text-accent hover:text-accent/80 dark:hover:text-accent/70", // Teal color, 48dp = h-12 w-12
                      "transition-transform duration-200 hover:scale-105 active:scale-100", // Simpler animation
                       isRecording && "animate-pulse-mic text-destructive hover:text-destructive/80 dark:hover:text-destructive/70" // Pulse animation
                      )}
                    disabled={disabled || isRecording}
                  >
                    <Mic className="h-6 w-6" /> {/* Larger icon */}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRecording ? "Stop recording" : "Start voice input"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {showClearButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClear}
                      aria-label="Clear text"
                      className="h-12 w-12 text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-transform duration-200 hover:scale-105 active:scale-100" // 48dp
                      disabled={disabled}
                    >
                      <X className="h-6 w-6" /> {/* Larger icon */}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear text</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>

      {/* Card Content: Textarea */}
      <CardContent className="flex-grow p-0 relative bg-card">
        <div className="relative h-full">
           <Textarea
             id={id}
             value={text}
             onChange={onTextChange}
             placeholder={placeholder}
             readOnly={type === 'target'}
             // Disable target textarea while loading/offline
             disabled={disabled || isRecording || (isEffectivelyLoading && type === 'target')}
             className={cn(
               'h-full min-h-[150px] md:min-h-[200px] w-full resize-none border-0 p-4 focus:outline-none focus:ring-0 focus:ring-offset-0', // Adjust min height
               'bg-card text-card-foreground placeholder:text-muted-foreground',
                // Apply Poppins Regular 18sp
               'font-sans text-lg leading-relaxed',
               disabled && 'bg-muted/30 dark:bg-muted/50 cursor-not-allowed', // Style when disabled
               // Remove teal underline
             )}
           />
           {/* Remove Typewriter Cursor */}
        </div>

         {/* Loading Shimmer for Target Panel */}
         {isEffectivelyLoading && (
           <div className="absolute inset-0 flex items-center justify-center bg-card/60 dark:bg-card/70 backdrop-blur-sm p-4">
             {/* Use Skeleton with shimmer */}
              <div className="w-full space-y-2">
                   <Skeleton className="h-6 w-3/4 animate-shimmer" />
                   <Skeleton className="h-6 w-full animate-shimmer" />
                   <Skeleton className="h-6 w-1/2 animate-shimmer" />
              </div>
           </div>
        )}

         {/* Offline Indicator */}
         {disabled && type === 'source' && ( // Show only on source panel when disabled
             <div className="absolute inset-0 flex items-center justify-center bg-card/50 dark:bg-card/60 backdrop-blur-sm">
                 <span className="text-sm font-medium text-muted-foreground p-2 bg-muted/80 dark:bg-muted/70 rounded-md font-sans">Offline</span>
             </div>
         )}
      </CardContent>

      {/* Card Footer: Copy and Speaker buttons */}
      <CardFooter className={cn(
        "justify-end border-t border-border/50 p-3 bg-card min-h-[64px]", // Ensure min height for buttons
        !showCopyButton && !showSpeakerButton && "hidden" // Hide footer if no buttons
      )}>
        <div className="flex items-center space-x-1">
          {showSpeakerButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onSpeakTranslation}
                    aria-label="Speak translation"
                    className={cn(
                        "h-12 w-12 text-accent hover:text-accent/80 dark:hover:text-accent/70", // Teal color, 48dp
                        "transition-transform duration-200 hover:scale-105 active:scale-100 fade-in-button" // Simpler animation + fade-in
                        )}
                    disabled={disabled}
                  >
                    <Volume2 className="h-6 w-6" /> {/* Larger icon */}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Speak translation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {showCopyButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCopy}
                    aria-label="Copy translation"
                    className="h-12 w-12 text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-transform duration-200 hover:scale-105 active:scale-100" // 48dp
                    disabled={disabled}
                  >
                    <Copy className="h-6 w-6" /> {/* Larger icon */}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy translation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
