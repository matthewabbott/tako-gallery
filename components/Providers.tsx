'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Client component wrapper for providers like ErrorBoundary
 * This allows us to use client components in the server component layout
 */
export function Providers({ children }: ProvidersProps) {
    return (
        <ErrorBoundary>
            {children}
        </ErrorBoundary>
    );
}
