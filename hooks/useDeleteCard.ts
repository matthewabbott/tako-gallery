'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearPagesGlobalCache } from './usePreloadCache';

interface UseDeleteCardResult {
    isDeleting: boolean;
    error: string | null;
    success: boolean;
    deleteCard: (cardId: string, apiKey: string) => Promise<void>;
}

export function useDeleteCard(): UseDeleteCardResult {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const deleteCard = async (cardId: string, apiKey: string) => {
        setIsDeleting(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`/api/cards/${cardId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete card');
            }

            // Clear the pages cache to force a fresh fetch
            clearPagesGlobalCache();

            setSuccess(true);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    return { isDeleting, error, success, deleteCard };
}
