
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google'; // Import Poppins font
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/contexts/theme-provider'; // Import ThemeProvider

// Configure Poppins font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Include needed weights (regular, semibold, bold)
  variable: '--font-poppins', // Use CSS variable
});

export const metadata: Metadata = {
  title: 'TranslateX', // Updated App Name
  description: 'Translate text between languages powered by AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
           // Use --background from theme for the main background
          'h-full bg-background text-foreground font-sans antialiased', // Use font-sans (mapped to Poppins)
          poppins.variable // Apply the CSS variable
        )}
      >
        <ThemeProvider
          storageKey="translatex-theme" // Use app-specific storage key
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
