import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/ui/layout/Footer';
import { Header } from '@/components/ui/layout/Header';
import { Providers } from '@/components/Providers';
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
            <body className={inter.className}>
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-grow">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
