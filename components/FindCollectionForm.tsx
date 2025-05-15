'use client';

import { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { ErrorDisplay } from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/LoadingState';

interface FindCollectionFormProps {
    className?: string;
}

export function FindCollectionForm({ className }: FindCollectionFormProps) {
    const router = useRouter();
    const [showApiKey, setShowApiKey] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFindCollection = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!apiKey) {
            setError('API key is required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/collections/find-by-api-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred while finding your collection');
            }

            // Store API key in session storage
            sessionStorage.setItem('takoApiKey', apiKey);

            // Redirect to the collection page with highlight=username parameter
            router.push(`/collections/${data.data.username}?highlight=username`);
        } catch (error) {
            console.error('Find collection error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`bg-white dark:bg-tako-dark-surface rounded-lg shadow-md dark:shadow-lg p-6 ${className}`}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-tako-dark-text-primary">Find Your Collection</h2>

            <p className="text-gray-600 dark:text-tako-dark-text-secondary mb-4 text-center">
                Already have a collection? Enter your Tako API key to find it.
            </p>

            <form onSubmit={handleFindCollection} className="space-y-6">
                <div>
                    <label htmlFor="findApiKey" className="block text-sm font-medium text-gray-700 dark:text-tako-dark-text-primary mb-1">
                        Tako API Key
                    </label>
                    <div className="relative">
                        <Input
                            id="findApiKey"
                            type={showApiKey ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Tako API key"
                            fullWidth
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-tako-dark-text-secondary dark:hover:text-tako-dark-text-primary"
                            onClick={() => setShowApiKey(!showApiKey)}
                        >
                            {showApiKey ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    isLoading={isLoading}
                    fullWidth
                >
                    <Search className="mr-2 h-4 w-4" />
                    Find My Collection
                </Button>
            </form>

            {error && (
                <div className="mt-6">
                    <ErrorDisplay error={error} />

                    {error.includes('No collection found') && (
                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-gray-700 dark:text-tako-dark-text-secondary">
                                You don't have a collection yet. You can:
                            </p>
                            <div className="flex flex-col xs:flex-row gap-2">
                                <Button
                                    onClick={() => {
                                        // Scroll to the generate visualization section
                                        document.getElementById('generate-visualization')?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start'
                                        });
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs" // Button variant handles dark mode
                                >
                                    Generate a card
                                </Button>
                                <a
                                    href="https://trytako.com/dashboard"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors bg-transparent dark:text-tako-dark-text-primary border border-gray-300 dark:border-tako-dark-border hover:bg-gray-100 dark:hover:bg-tako-dark-border focus-visible:ring-gray-400 dark:focus-visible:ring-tako-dark-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-8 py-1 px-3"
                                >
                                    <span>Is your API key valid?</span>
                                    <ExternalLink className="h-3 w-3 ml-1" /> {/* Icon color will inherit from text */}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {isLoading && (
                <div className="mt-6 flex justify-center">
                    <LoadingState text="Finding your collection..." />
                </div>
            )}
        </div>
    );
}
