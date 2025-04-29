
import * as React from 'react';
import { Star, Languages, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { TranslationEntry } from '@/lib/types';
import { getLanguageByValue } from '@/lib/languages';
import { cn } from '@/lib/utils';

interface HistoryItemCardProps {
  entry: TranslationEntry;
  onToggleFavorite: (id: string) => void;
}

export function HistoryItemCard({ entry, onToggleFavorite }: HistoryItemCardProps) {
  const sourceLangLabel = getLanguageByValue(entry.sourceLanguageCode || entry.sourceLanguage)?.label || entry.sourceLanguage;
  const targetLangLabel = getLanguageByValue(entry.targetLanguageCode || entry.targetLanguage)?.label || entry.targetLanguage;
  const timeAgo = formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click or other events
    onToggleFavorite(entry.id);
  };

  return (
    // Use standard card styles with fade-in animation
    <Card className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out animate-fade-in",
        "bg-card text-card-foreground rounded-xl shadow-md border border-border/50", // Standard card style
        "hover:shadow-lg" // Subtle hover effect
    )}>
      <CardHeader className="p-3 border-b border-border/30">
        <div className="flex justify-between items-center">
          {/* Language Info */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
            <Languages className="h-3 w-3" />
            <span>{sourceLangLabel}</span>
            <span>&rarr;</span>
            <span>{targetLangLabel}</span>
          </div>
          {/* Favorite Button */}
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                      "h-8 w-8 rounded-full transition-transform duration-200 ease-out", // Smaller icon button
                      "text-muted-foreground hover:text-accent hover:scale-110 active:scale-105",
                      entry.isFavorite && "text-accent scale-110 fill-current" // Fill star when favorite
                  )}
                  onClick={handleFavoriteClick}
                  aria-label={entry.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={entry.isFavorite}
                >
                  {/* Use fill-current when favorite */}
                  <Star className={cn("h-4 w-4", entry.isFavorite && "fill-current")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{entry.isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      {/* Card Content - Poppins font */}
      <CardContent className="p-3 space-y-1">
         {/* Use text-lg (18sp equivalent) */}
        <p className="text-lg font-sans font-medium line-clamp-2 text-foreground">{entry.sourceText}</p>
        <p className="text-lg font-sans line-clamp-2 text-muted-foreground">{entry.targetText}</p>
      </CardContent>
      {/* Card Footer */}
      <CardFooter className="p-3 border-t border-border/30 text-xs text-muted-foreground flex items-center justify-end font-sans">
        <Clock className="h-3 w-3 mr-1" />
        <span>{timeAgo}</span>
      </CardFooter>
    </Card>
  );
}
