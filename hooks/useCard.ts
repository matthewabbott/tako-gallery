'use client';

import { useState, useEffect } from 'react';
import { Card } from './useCards';

interface UseCardResult {
    card: Card | null;
    loading: boolean;
    error: string | null;
}

export function useCard(cardId: string): UseCardResult {
    const [card, setCard] = useState<Card | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!cardId) {
            setLoading(false);
            return;
        }

        const fetchCard = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/cards/${cardId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch card');
                }

                setCard(data.data.card);
            } catch (error) {
                console.error('Error fetching card:', error);
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchCard();
    }, [cardId]);

    return { card, loading, error };
}
