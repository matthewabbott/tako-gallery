'use client';

import { useState } from 'react';
import { Search, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { useSearch } from '@/hooks/useSearch';
import { ErrorDisplay } from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/LoadingState';

interface SearchFormProps {
    className?: string;
}

export function SearchForm({ className }: SearchFormProps) {
    // Add an ID to the form for scrolling
    const [showApiKey, setShowApiKey] = useState(false);

    const {
        apiKey,
        setApiKey,
        query,
        setQuery,
        isLoading,
        error,
        result,
        handleSearch,
    } = useSearch();

    return (
        <div id="generate-visualization" className={`bg-slate-50 dark:bg-tako-dark-surface rounded-lg shadow-md dark:shadow-lg p-6 ${className}`}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-tako-dark-text-primary">Generate a Visualization</h2>

            <form onSubmit={handleSearch} className="space-y-6">
                <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-tako-dark-text-primary mb-1">
                        Tako API Key
                    </label>
                    <div className="relative">
                        <Input
                            id="apiKey"
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
                    <p className="mt-1 text-xs text-gray-500 dark:text-tako-dark-text-secondary">
                        Don't have a Tako API key? <a href="https://trytako.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 visited:text-primary-600 hover:underline dark:text-blue-400 dark:visited:text-tako-dark-accent dark:hover:underline">Get one here</a>.
                    </p>
                </div>

                <div>
                    <label htmlFor="query" className="block text-sm font-medium text-gray-700 dark:text-tako-dark-text-primary mb-1">
                        Search Query
                    </label>
                    <TextArea
                        id="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., Tesla stock price vs revenue"
                        fullWidth
                        required
                        rows={2}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-tako-dark-text-secondary">
                        Enter a natural language query to generate a data visualization.
                    </p>
                </div>

                <Button
                    type="submit"
                    isLoading={isLoading}
                    fullWidth
                >
                    <Search className="mr-2 h-4 w-4" />
                    Generate Visualization
                </Button>
            </form>

            {error && (
                <div className="mt-6">
                    <ErrorDisplay error={error} />
                </div>
            )}

            {result && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" /> {/* Icon color will inherit */}
                    <div>
                        <p className="font-medium">Success!</p> {/* Text color inherited */}
                        <p className="text-sm">
                            Visualization "{result.card.title}" has been generated and saved to your collection.
                        </p>
                        <p className="text-sm mt-1">
                            Redirecting you to your collection...
                        </p>
                        <Link
                            href={`/collections/${result.collection.username}?cardId=${result.card.cardId}`}
                            className="text-blue-600 visited:text-primary-600 hover:underline dark:text-blue-400 dark:visited:text-tako-dark-accent dark:hover:underline text-sm mt-2 inline-flex items-center"
                        >
                            <span>View your collection</span>
                            <ArrowRight className="h-3 w-3 ml-1" /> {/* Icon color will inherit */}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
