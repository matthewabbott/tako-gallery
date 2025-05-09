'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseDeleteCollectionResult {
    isDeleting: boolean;
    error: string | null;
    success: boolean;
    isValidApiKey: boolean;
    deleteCollection: (username: string, apiKey: string) => Promise<void>;
    validateApiKey: (username: string, apiKey: string) => Promise<boolean>;
}

export function useDeleteCollection(): UseDeleteCollectionResult {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isValidApiKey, setIsValidApiKey] = useState(false);
    const router = useRouter();

    const validateApiKey = async (username: string, apiKey: string): Promise<boolean> => {
        if (!apiKey) return false;

        try {
            // Use the find-by-api-key endpoint to validate the API key
            const response = await fetch('/api/collections/find-by-api-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to validate API key');
            }

            // Check if the API key belongs to this collection
            const isValid = data.data.username === username;
            setIsValidApiKey(isValid);
            return isValid;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred validating the API key');
            setIsValidApiKey(false);
            return false;
        }
    };

    const deleteCollection = async (username: string, apiKey: string) => {
        setIsDeleting(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`/api/collections/${username}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete collection');
            }

            setSuccess(true);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    return { isDeleting, error, success, isValidApiKey, deleteCollection, validateApiKey };
}
