'use client';

import { useState } from 'react';
import { X, Search, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { ErrorDisplay } from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/LoadingState';
import { clearPagesGlobalCache } from '@/hooks/usePreloadCache';

interface NewCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
    onSuccess?: () => void;
}

export function NewCardModal({ isOpen, onClose, username, onSuccess }: NewCardModalProps) {
    const [apiKey, setApiKey] = useState('');
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any | null>(null);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!apiKey || !query) {
            setError('API key and query are required');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey, query }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred while searching');
            }

            // Check if the API key matches the collection
            if (data.data.collection.username.toLowerCase() !== username.toLowerCase()) {
                throw new Error('The API key does not match this collection');
            }

            setResult(data.data);

            // Clear the pages cache to force a fresh fetch
            clearPagesGlobalCache();

            // Call onSuccess callback if provided
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            }

            // Reset form after a delay
            setTimeout(() => {
                setApiKey('');
                setQuery('');
            }, 2000);

        } catch (error) {
            console.error('Search error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Create New Card</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {result ? (
                    <div className="p-6">
                        <div className="p-4 bg-green-50 text-green-700 rounded-md flex items-start mb-6">
                            <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Success!</p>
                                <p>Card "{result.card.title}" has been created and added to your collection.</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-3">{result.card.title}</h3>
                        <div className="relative aspect-video rounded-md overflow-hidden border mb-4">
                            <iframe
                                src={result.card.embedUrl}
                                className="absolute inset-0 w-full h-full"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={onClose}>Close</Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                                Tako API Key
                            </label>
                            <Input
                                id="apiKey"
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your Tako API key"
                                fullWidth
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Enter the API key associated with this collection.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                                Search Query
                            </label>
                            <Input
                                id="query"
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g., Tesla stock price vs revenue"
                                fullWidth
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Enter a natural language query to generate a data visualization.
                            </p>
                        </div>

                        {error && (
                            <div className="mt-2">
                                <ErrorDisplay error={error} />
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                            >
                                <Search className="mr-2 h-4 w-4" />
                                Generate Card
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
