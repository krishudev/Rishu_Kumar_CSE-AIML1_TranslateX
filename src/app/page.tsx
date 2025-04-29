
'use client'; // Add 'use client' because we need state

import { useState, useEffect } from 'react'; // Import useEffect for animations
import { History, Settings, Send } from 'lucide-react'; // Import icons
import Link from 'next/link'; // Import Link for navigation
import { Translator } from '@/components/translator';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { HistoryPanel } from '@/components/history-panel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function Home() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); // State for history sheet
  const [isMounted, setIsMounted] = useState(false); // State for mount animation

  useEffect(() => {
    setIsMounted(true); // Trigger animation on mount
  }, []);

  // Staggered animation delays (adjust as needed)
  const headerDelay = 1; // 100ms
  const translatorDelay = 2; // 200ms

  // Placeholder function for FAB click - connect to Translator's handleTranslate
  const handleTranslateClick = () => {
    // This needs to trigger the translation logic inside the Translator component.
    // We might need to lift state up or use a ref/context if Translator doesn't expose a trigger.
    // For now, we'll log a message.
    console.log("FAB clicked - trigger translation");
     // Example: Dispatch a custom event that Translator listens for
     window.dispatchEvent(new CustomEvent('fabTranslateTrigger'));
  };

  return (
    // Use flex-col for vertical stacking on mobile
    <main className="flex min-h-screen flex-col items-center bg-background">
      {/* Header: Sticky, primary color, animation */}
      <header className={cn(
          "sticky top-0 z-50 w-full p-4 shadow-md flex justify-between items-center transition-colors duration-300",
          "bg-primary text-primary-foreground", // Use primary color from theme
          isMounted && "animate-fade-in" // Apply animation only after mount
          // No staggered delay needed here if it's the first element
          )}>

        {/* History Button */}
        <TooltipProvider>
           <Tooltip>
             <TooltipTrigger asChild>
               <Button
                 variant="ghost"
                 size="icon"
                 className="h-10 w-10 text-primary-foreground hover:bg-primary/80 dark:hover:bg-primary/70 transition-transform duration-200 hover:scale-110 active:scale-105 dark:button-glow-dark" // Standard touch target size
                 onClick={() => setIsHistoryOpen(true)}
                 aria-label="View translation history"
               >
                 <History className="h-5 w-5" />
               </Button>
             </TooltipTrigger>
             <TooltipContent>
               <p>History</p>
             </TooltipContent>
           </Tooltip>
         </TooltipProvider>

        {/* App Title */}
        <h1 className={cn(
            "text-center text-xl font-bold text-primary-foreground flex-grow px-4", // Adjusted size
             "font-sans" // Ensure font-sans is applied which maps to Poppins
        )}>
          TranslateX
        </h1>

         {/* Settings and Theme Toggle */}
         <div className="flex items-center gap-2">
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                  <Link href="/settings" passHref>
                   <Button
                     variant="ghost"
                     size="icon"
                     className="h-10 w-10 text-primary-foreground hover:bg-primary/80 dark:hover:bg-primary/70 transition-transform duration-200 hover:scale-110 active:scale-105 dark:button-glow-dark" // Standard touch target size
                     aria-label="Open settings"
                   >
                     <Settings className="h-5 w-5" />
                   </Button>
                  </Link>
               </TooltipTrigger>
               <TooltipContent>
                 <p>Settings</p>
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>
           <ThemeToggle />
         </div>
      </header>

       {/* Translator component takes remaining space */}
      <div className={cn(
         "w-full flex-grow",
          isMounted && "animate-staggered-fade-in", // Apply animation only after mount
          `[animation-delay:${translatorDelay*100}ms]` // Apply delay
      )}>
        <Translator />
      </div>

       {/* Floating Action Button for Translate (Mobile only) */}
       <TooltipProvider>
         <Tooltip>
            <TooltipTrigger asChild>
                <button
                  className="fab" // Apply FAB styles from globals.css
                  onClick={handleTranslateClick}
                  aria-label="Translate text"
                >
                  <Send /> {/* Use Send icon for translate action */}
                  {/* Ripple effect handled by Button component logic if FAB is a Button */}
                </button>
            </TooltipTrigger>
            <TooltipContent side="left">
                <p>Translate</p>
            </TooltipContent>
         </Tooltip>
       </TooltipProvider>


      {/* Footer removed as per request */}

      {/* History Panel Sheet */}
      <HistoryPanel open={isHistoryOpen} onOpenChange={setIsHistoryOpen} />
    </main>
  );
}
