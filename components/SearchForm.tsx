'use client';

import { useState } from 'react';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useSearch } from '@/hooks/useSearch';

interface SearchFormProps {
    className?: string;
}

export function SearchForm({ className }: SearchFormProps) {
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
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <h2 className="text-2xl font-bold mb-6 text-center">Generate a Visualization</h2>

            <form onSubmit={handleSearch} className="space-y-6">
                <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
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
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowApiKey(!showApiKey)}
                        >
                            {showApiKey ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Don&apos;t have a Tako API key? <a href="https://trytako.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Get one here</a>.
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
                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {result && (
                <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-md flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium">Success!</p>
                        <p className="text-sm">
                            Visualization &quot;{result.card.title}&quot; has been generated and saved to your collection.
                        </p>
                        <a
                            href={`/collections/${result.collection.username}`}
                            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                        >
                            View your collection
                        </a>
                    </div>
                </div>
            )}

            {result && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">{result.card.title}</h3>
                    <div className="relative aspect-video rounded-md overflow-hidden border">
                        <iframe
                            src={result.card.embedUrl}
                            className="absolute inset-0 w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
}
