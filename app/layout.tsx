import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/ui/layout/Footer';
import { Header } from '@/components/ui/layout/Header';
import { Providers as AppProviders } from '@/components/Providers'; // Renaming to avoid conflict
import { ThemeProvider } from '@/context/ThemeContext';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Tako Gallery',
    description: 'A gallery of data visualizations generated from Tako Knowledge Search API',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
(function() {
  var themeToApply = 'light'; // Default to light
  try {
    var storedTheme = localStorage.getItem('tako-gallery-theme');

    if (storedTheme === 'light' || storedTheme === 'dark') {
      themeToApply = storedTheme;
    } else if (storedTheme === 'system') {
      // If preference is 'system', check actual system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        themeToApply = 'dark';
      } else {
        themeToApply = 'light';
      }
    } else {
      // No theme stored, or invalid value, so check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        themeToApply = 'dark';
      }
      // else it remains 'light'
    }
  } catch (e) {
    // In case of any error (e.g., localStorage not available), default to light
    // themeToApply is already 'light'
  }

  if (themeToApply === 'dark') {
    document.documentElement.classList.add('dark');
  }
  // The ThemeProvider will still run later to manage the theme,
  // set the 'light' class if needed, and handle dynamic changes.
  // It will also ensure localStorage 'tako-gallery-theme' reflects the user's *preference*
  // (e.g., 'system'), even if 'dark' was applied here based on resolving 'system'.
})();
    `,
                    }}
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
            </head>
            <body className={inter.className}>
                <ThemeProvider
                    defaultTheme="system"
                    storageKey="tako-gallery-theme"
                >
                    <AppProviders>
                        <div className="flex flex-col min-h-screen">
                            <Header />
                            <main className="flex-grow">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </AppProviders>
                </ThemeProvider>
            </body>
        </html>
    );
}
