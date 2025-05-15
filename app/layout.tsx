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
  function getInitialTheme() {
    try {
      const storedTheme = localStorage.getItem('tako-gallery-theme');
      if (storedTheme) {
        return storedTheme;
      }
      // If no stored theme, check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      // Return 'system' to let ThemeProvider handle it, or resolve directly
      // For this script, resolving directly is better to avoid flash
      return systemPrefersDark ? 'dark' : 'light';
    } catch (e) {
      return 'light'; // Default to light in case of error or no support
    }
  }
  const theme = getInitialTheme();
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
  // If theme is 'light', no class is needed initially as it's the default un-dark state
  // The ThemeProvider will later ensure the correct class ('light' or 'dark') is set
  // and remove 'dark' if the resolved theme becomes light.
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
