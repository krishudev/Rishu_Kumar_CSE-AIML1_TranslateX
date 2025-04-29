
import * as React from 'react';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { Language } from '@/lib/languages';
import { cn } from '@/lib/utils';

// Placeholder for fetching flag emojis or using a library
// Basic mapping for demonstration purposes
const flagEmojis: { [key: string]: string } = {
    en: '🇺🇸', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', it: '🇮🇹',
    pt: '🇵🇹', ja: '🇯🇵', ko: '🇰🇷', zh: '🇨🇳', ru: '🇷🇺', hi: '🇮🇳',
    // Add more mappings as needed
};


function getFlagEmoji(langCode: string): string {
    return flagEmojis[langCode] || '🏳️'; // Default flag
}


interface LanguageSelectorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  languages: Language[];
  selectedLanguage: string;
  onSelectLanguage: (languageValue: string) => void;
  title: string;
}

export function LanguageSelectorSheet({
  open,
  onOpenChange,
  languages,
  selectedLanguage,
  onSelectLanguage,
  title,
}: LanguageSelectorSheetProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.nativeLabel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value: string) => {
    onSelectLanguage(value);
    onOpenChange(false); // Close sheet on selection
    setSearchTerm(''); // Reset search term
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          'rounded-t-2xl h-[70vh] flex flex-col p-0', // Use rounded-2xl for 16px radius, adjust height
           'sheet-content-background' // Apply themed background class
        )}
        aria-describedby={undefined} // Remove default description if not needed
      >
        {/* Header with Primary background and rounded top corners */}
        <SheetHeader className="p-4 border-b sheet-header-background rounded-t-2xl">
          {/* Use Poppins font */}
          <SheetTitle className="text-center text-lg font-semibold font-sans">
            {title}
          </SheetTitle>
        </SheetHeader>
         {/* Search bar uses background color */}
        <div className="p-4 border-b bg-background">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full h-10" // Ensure consistent height
              aria-label="Search languages"
            />
          </div>
        </div>
        {/* Scroll area uses background color */}
        <ScrollArea className="flex-grow bg-background">
          <div className="p-4 grid gap-2">
            {filteredLanguages.map((lang) => (
              <Button
                key={lang.value}
                variant={
                  selectedLanguage === lang.value ? 'default' : 'ghost'
                }
                onClick={() => handleSelect(lang.value)}
                className={cn(
                  'justify-start text-left h-auto py-3', // Remove complex animations
                   'font-sans text-lg', // Ensure correct font size
                  selectedLanguage === lang.value
                    ? 'bg-accent text-accent-foreground font-semibold' // Use accent for selection
                    : 'hover:bg-muted/50' // Use muted for hover
                )}
                aria-pressed={selectedLanguage === lang.value}
              >
                 {/* Flag Icon */}
                 <span className="mr-3 text-xl">{getFlagEmoji(lang.value)}</span>
                <div className="flex flex-col">
                   {/* Native Label */}
                  <span className="font-medium">{lang.label}</span>
                  {lang.nativeLabel && lang.label !== lang.nativeLabel && (
                     <span className="text-sm text-muted-foreground">{lang.nativeLabel}</span>
                  )}
                </div>
              </Button>
            ))}
            {filteredLanguages.length === 0 && (
              <p className="text-center text-muted-foreground p-4 font-sans">No languages found.</p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
