'use client';

import { useEffect } from 'react';
import { ErrorDisplay } from '@/components/ErrorBoundary';

/**
 * Global error page for Next.js app router
 * This component is rendered when an error occurs in a route segment
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    // Log the error to the console
    useEffect(() => {
        console.error('Global error caught:', error);
    }, [error]);

    return (
        <ErrorDisplay
            error={error}
            reset={reset}
            fullPage
        />
    );
}
