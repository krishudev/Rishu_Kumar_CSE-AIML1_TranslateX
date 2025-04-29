
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/contexts/theme-provider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label'; // Import Label for accessibility
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Import Tooltip

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Ensure component is mounted before rendering theme-dependent UI
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder or null during SSR/hydration mismatch phase
     return <div className="h-10 w-10"></div>; // Placeholder with standard touch target size
  }

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleCheckedChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
           {/* Ensure container allows for focus on switch */}
          <div className="flex items-center space-x-2 p-1 rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-primary">
            <Sun className={cn("h-5 w-5 text-primary-foreground transition-opacity", isDarkMode ? 'opacity-50' : 'opacity-100')} />
            <Switch
              id="theme-switch"
              checked={isDarkMode}
              onCheckedChange={handleCheckedChange}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
               // Style the switch using accent color for the checked state
               className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-muted focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-2 dark:button-glow-dark" // Added dark mode glow
            />
            <Moon className={cn("h-5 w-5 text-primary-foreground transition-opacity", isDarkMode ? 'opacity-100' : 'opacity-50')} />
            <Label htmlFor="theme-switch" className="sr-only">
              Toggle Theme
            </Label>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {isDarkMode ? 'light' : 'dark'} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
