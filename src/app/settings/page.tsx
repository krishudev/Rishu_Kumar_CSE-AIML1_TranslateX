
'use client';

import * as React from 'react';
import { ArrowLeft, Wifi, WifiOff, Moon, Sun, Settings as SettingsIcon } from 'lucide-react'; // Renamed Settings icon import
import { useRouter } from 'next/navigation'; // Use App Router's navigation

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useOnlineStatus } from '@/hooks/use-online-status'; // Import the custom hook
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/theme-provider'; // Import useTheme hook

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const { theme, setTheme } = useTheme(); // Use theme hook

  // State for offline mode preference (persisted in localStorage)
  const [offlineModeEnabled, setOfflineModeEnabled] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('offlineModeEnabled') === 'true';
    }
    return false; // Default to false if localStorage is not available (SSR)
  });

  // Update localStorage when the toggle changes
  const handleOfflineModeToggle = (checked: boolean) => {
    setOfflineModeEnabled(checked);
    localStorage.setItem('offlineModeEnabled', String(checked));
    toast({
      title: `Offline Mode ${checked ? 'Enabled' : 'Disabled'}`,
      description: checked
        ? 'App will use cached data when offline.'
        : 'App will prioritize live data.',
       // Use accent color for snackbar
       className: 'bg-notification text-notification-foreground border-transparent',
       duration: 3000,
    });
  };

  return (
    // Apply background directly using theme variable
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header - Use primary color */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-primary px-4 shadow-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()} // Go back to the previous page
           // Use primary foreground color for icon
          className="h-10 w-10 text-primary-foreground hover:bg-primary/80 dark:hover:bg-primary/70 dark:button-glow-dark" // Standard touch target
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
         {/* Use Poppins Bold for heading */}
        <h1 className="text-xl font-bold font-sans text-primary-foreground">Settings</h1>
        {/* Use Settings Icon */}
        <SettingsIcon className="h-6 w-6 text-primary-foreground opacity-50" />
      </header>

      {/* Main Content Area - Use background color */}
      <main className="flex-grow p-4 md:p-6 bg-background">
        <div className="mx-auto max-w-2xl space-y-4">
          {/* Offline Mode Card - Use card color, rounded-xl */}
          <Card className="overflow-hidden shadow-md rounded-xl bg-card text-card-foreground">
             {/* Use Poppins Bold for Card Title */}
            <CardHeader>
              <CardTitle className="text-lg font-bold font-sans">Offline Mode</CardTitle>
              <CardDescription className="text-muted-foreground font-sans">
                Enable offline mode to use cached translations when not connected.
              </CardDescription>
            </CardHeader>
            <CardContent>
               {/* Use background for inner container */}
              <div className="flex items-center justify-between space-x-4 rounded-lg border border-border/50 p-4 bg-background text-foreground">
                <Label htmlFor="offline-mode-switch" className="flex flex-col space-y-1">
                   {/* Use Poppins Semi-Bold */}
                  <span className="font-semibold font-sans">Enable Offline Mode</span>
                   {/* Use Poppins Regular */}
                  <span className="text-sm text-muted-foreground font-sans">
                    Uses cached data when offline.
                  </span>
                </Label>
                 {/* Use accent for checked state */}
                <Switch
                  id="offline-mode-switch"
                  checked={offlineModeEnabled}
                  onCheckedChange={handleOfflineModeToggle}
                  aria-label="Toggle offline mode"
                  className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-muted dark:button-glow-dark"
                />
              </div>
              {/* Display current online status */}
              <div className={cn(
                "mt-4 flex items-center gap-2 rounded-md p-3 text-sm font-sans", // Ensure Poppins
                 // Use themed colors for online/offline status indicator
                isOnline ? "bg-green-600/20 text-green-700 dark:bg-green-800/30 dark:text-green-300" : "bg-yellow-600/20 text-yellow-700 dark:bg-yellow-800/30 dark:text-yellow-300"
                )}>
                  {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                  <span>{isOnline ? 'You are currently online.' : 'You are currently offline.'}</span>
              </div>
                { !isOnline && offlineModeEnabled && (
                    <p className="mt-2 text-xs text-muted-foreground font-sans">
                        Offline mode is active. Cached translations will be used if available.
                    </p>
                )}
                 { !isOnline && !offlineModeEnabled && (
                    <p className="mt-2 text-xs text-destructive font-sans">
                        Offline mode is disabled. Translation may not work.
                    </p>
                )}
            </CardContent>
          </Card>

           {/* Theme Settings Card - Use card color, rounded-xl */}
           <Card className="overflow-hidden shadow-md rounded-xl bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-lg font-bold font-sans">Appearance</CardTitle>
              <CardDescription className="text-muted-foreground font-sans">
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
               {/* Use background */}
              <div className="flex items-center justify-between space-x-4 rounded-lg border border-border/50 p-4 bg-background text-foreground">
                 {/* Use Poppins Semi-Bold */}
                <Label htmlFor="theme-toggle-button" className="font-semibold font-sans">
                  Theme
                </Label>
                 {/* Theme Toggle Buttons */}
                 <div className="flex gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setTheme('light')}
                      aria-pressed={theme === 'light'}
                      className={cn(
                         "h-10 w-10 dark:button-glow-dark", // Standard touch target
                         theme === 'light' && 'bg-accent text-accent-foreground' // Highlight active theme
                      )}
                      aria-label="Switch to light theme"
                    >
                      <Sun className="h-5 w-5" />
                    </Button>
                     <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setTheme('dark')}
                      aria-pressed={theme === 'dark'}
                      className={cn(
                         "h-10 w-10 dark:button-glow-dark", // Standard touch target
                          theme === 'dark' && 'bg-accent text-accent-foreground' // Highlight active theme
                       )}
                       aria-label="Switch to dark theme"
                    >
                      <Moon className="h-5 w-5" />
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      onClick={() => setTheme('system')}
                       aria-pressed={theme === 'system'}
                       className={cn(
                          "h-10 px-3 text-sm dark:button-glow-dark", // Standard touch target height
                           theme === 'system' && 'bg-accent text-accent-foreground' // Highlight active theme
                        )}
                        aria-label="Switch to system theme preference"
                    >
                      System
                    </Button>
                  </div>
              </div>
            </CardContent>
          </Card>

          {/* Placeholder for Login Button */}
           <Card className="overflow-hidden shadow-md rounded-xl bg-card text-card-foreground">
             <CardHeader>
               <CardTitle className="text-lg font-bold font-sans">Account</CardTitle>
               <CardDescription className="text-muted-foreground font-sans">
                 Sign in to sync preferences and history.
               </CardDescription>
             </CardHeader>
             <CardContent>
               <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                 Sign In / Sign Up
               </Button>
                {/* Add Google Sign-in later */}
                {/* <Button variant="outline" className="w-full mt-2">
                    Sign in with Google
                </Button> */}
             </CardContent>
           </Card>

        </div>
      </main>
    </div>
  );
}
