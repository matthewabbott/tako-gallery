'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearPagesGlobalCache } from './usePreloadCache';

interface UsernameAvailability {
    available: boolean;
    error?: string;
}

interface UseUsernameProps {
    initialApiKey?: string;
    onSuccess?: (username: string, collectionUrl: string) => void;
}

export function useUsername({ initialApiKey, onSuccess }: UseUsernameProps = {}) {
    const router = useRouter();
    const [apiKey, setApiKey] = useState(initialApiKey || '');
    const [username, setUsername] = useState('');
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [availabilityError, setAvailabilityError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [collectionUrl, setCollectionUrl] = useState<string | null>(null);

    // Check username availability when username changes
    useEffect(() => {
        const checkAvailability = async () => {
            if (!username || username.length < 3) {
                setIsAvailable(null);
                setAvailabilityError(null);
                return;
            }

            setIsCheckingAvailability(true);
            setAvailabilityError(null);

            try {
                const response = await fetch(`/api/username?username=${encodeURIComponent(username)}`);
                const data = await response.json();

                if (response.ok && data.success) {
                    setIsAvailable(data.data.available);
                    setAvailabilityError(data.data.error || null);
                } else {
                    setIsAvailable(false);
                    setAvailabilityError(data.error || 'Failed to check availability');
                }
            } catch (error) {
                setIsAvailable(false);
                setAvailabilityError('Error checking availability');
            } finally {
                setIsCheckingAvailability(false);
            }
        };

        const timeoutId = setTimeout(checkAvailability, 500);
        return () => clearTimeout(timeoutId);
    }, [username]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!apiKey || !username) {
            setError('API key and username are required');
            return;
        }

        if (!isAvailable) {
            setError('Please choose an available username');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey, username }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred while updating username');
            }

            // Set collection URL
            setCollectionUrl(data.data.collectionUrl);

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess(data.data.username, data.data.collectionUrl);
            }

            // Clear API key from session storage if it exists
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('takoApiKey');
            }

            // Clear the pages cache to force a fresh fetch when redirecting
            clearPagesGlobalCache();

            // Redirect to collection page
            router.push(`/collections/${data.data.username}`);
        } catch (error) {
            console.error('Username update error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        apiKey,
        setApiKey,
        username,
        setUsername,
        isAvailable,
        availabilityError,
        isLoading,
        error,
        isCheckingAvailability,
        collectionUrl,
        handleSubmit,
    };
}
