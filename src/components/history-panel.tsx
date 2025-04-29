
import * as React from 'react';
import { Search, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { TranslationEntry } from '@/lib/types'; // Define this type
import { HistoryItemCard } from '@/components/history-item-card';
import { fetchHistory, toggleFavorite } from '@/services/historyService'; // Import placeholder functions
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

interface HistoryPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistoryPanel({ open, onOpenChange }: HistoryPanelProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [history, setHistory] = React.useState<TranslationEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showFavorites, setShowFavorites] = React.useState(false); // State to filter favorites

  // Fetch history when the sheet opens
  React.useEffect(() => {
    if (open) {
      const loadHistory = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await fetchHistory(); // Fetch from service
          setHistory(data);
        } catch (err) {
          console.error('Failed to fetch history:', err);
          setError('Failed to load history. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      loadHistory();
    } else {
      // Reset state when closing
      setSearchTerm('');
      setShowFavorites(false);
    }
  }, [open]);

  const handleToggleFavorite = async (id: string) => {
    // Optimistic update
    setHistory((prevHistory) =>
      prevHistory.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
    try {
      await toggleFavorite(id); // Update in backend/service
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      // Revert optimistic update on error
      setHistory((prevHistory) =>
        prevHistory.map((item) =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );
      // Optionally show a toast notification for the error
    }
  };

  const filteredHistory = history
    .filter((item) => {
      if (showFavorites && !item.isFavorite) {
        return false; // Hide non-favorites if filter is active
      }
      const term = searchTerm.toLowerCase();
      if (!term) return true; // No search term, show all (respecting favorite filter)
      return (
        item.sourceText.toLowerCase().includes(term) ||
        item.targetText.toLowerCase().includes(term) ||
        item.sourceLanguage.toLowerCase().includes(term) || // Search by language label
        item.targetLanguage.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left" // Open from the left
        className={cn(
          'w-full sm:w-3/4 md:w-1/2 lg:w-1/3 flex flex-col p-0', // Use sheet's default background
          'sheet-content-background' // Apply themed background class
        )}
        aria-describedby={undefined}
      >
        <SheetHeader className="p-4 border-b sheet-header-background">
          {' '}
          {/* Primary background */}
           {/* Use Poppins font */}
          <SheetTitle className="text-center text-lg font-semibold font-sans">
            History & Favorites
          </SheetTitle>
        </SheetHeader>
        <div className="p-4 border-b flex items-center gap-2 bg-background"> {/* Search bar uses background */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full h-10" // Ensure consistent height
              aria-label="Search history"
            />
          </div>
           {/* Favorite Filter Button */}
          <Button
            variant={showFavorites ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFavorites(!showFavorites)}
            aria-pressed={showFavorites}
            aria-label={showFavorites ? "Show all history" : "Show favorites only"}
            className={cn(
                "h-10 w-10 shrink-0", // Standard touch target size
                showFavorites && "bg-accent text-accent-foreground" // Use accent color when active
             )}
          >
            {/* Use accent color for fill when active */}
            <Star className={cn("h-5 w-5", showFavorites && "fill-current text-accent-foreground")} />
          </Button>
        </div>
        <ScrollArea className="flex-grow bg-background"> {/* Scroll area uses background */}
          <div className="p-4 grid gap-3">
            {isLoading ? (
              // Show shimmer skeletons while loading
              Array.from({ length: 5 }).map((_, index) => (
                 <Skeleton key={index} className="h-28 w-full rounded-xl animate-shimmer" /> // Use shimmer animation
              ))
            ) : error ? (
              <p className="text-center text-destructive p-4 font-sans">{error}</p>
            ) : filteredHistory.length === 0 ? (
              <p className="text-center text-muted-foreground p-4 font-sans">
                {searchTerm ? 'No matching history found.' : 'No translation history yet.'}
                {showFavorites && history.length > 0 && !searchTerm && ' No favorites marked.'}
              </p>
            ) : (
              filteredHistory.map((item) => (
                <HistoryItemCard
                  key={item.id}
                  entry={item}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
