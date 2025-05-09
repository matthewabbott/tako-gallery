'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
    card: {
        id: string;
        cardId: string;
        title: string;
        description: string;
        webpageUrl: string;
        imageUrl: string;
        embedUrl: string;
        query: string;
        createdAt: string;
    };
    collection: {
        username: string;
        isNewUser: boolean;
    };
}

interface UseSearchProps {
    onSuccess?: (result: SearchResult) => void;
}

export function useSearch({ onSuccess }: UseSearchProps = {}) {
    const router = useRouter();
    const [apiKey, setApiKey] = useState('');
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SearchResult | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
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

            const searchResult = data.data as SearchResult;
            setResult(searchResult);

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess(searchResult);
            }

            // Store API key in session storage regardless of whether it's a new user
            sessionStorage.setItem('takoApiKey', apiKey);

            // Redirect to the collection page with the cardId parameter
            // If this is a new user, also add a URL parameter to highlight the username change button
            const cardId = searchResult.card.cardId;
            if (searchResult.collection.isNewUser) {
                router.push(`/collections/${searchResult.collection.username}?highlight=username&cardId=${cardId}`);
            } else {
                router.push(`/collections/${searchResult.collection.username}?cardId=${cardId}`);
            }
        } catch (error) {
            console.error('Search error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setQuery('');
        setError(null);
        setResult(null);
    };

    return {
        apiKey,
        setApiKey,
        query,
        setQuery,
        isLoading,
        error,
        result,
        handleSearch,
        resetForm,
    };
}
