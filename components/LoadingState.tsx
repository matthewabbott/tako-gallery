'use client';

import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullPage?: boolean;
    className?: string;
}

/**
 * A reusable loading component with consistent styling across the application
 */
export function LoadingState({
    size = 'md',
    text = 'Loading...',
    fullPage = false,
    className = ''
}: LoadingStateProps) {
    // Determine the size of the loader
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };

    // Determine the size of the text
    const textClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    const loaderSize = sizeClasses[size];
    const textSize = textClasses[size];

    const content = (
        <div className={`flex items-center justify-center ${className}`}>
            <Loader2 className={`${loaderSize} animate-spin text-blue-600`} aria-hidden="true" />
            {text && <span className={`ml-2 text-gray-600 ${textSize}`}>{text}</span>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                {content}
            </div>
        );
    }

    return content;
}

/**
 * A skeleton loading component for content that hasn't loaded yet
 */
export function SkeletonLoader({
    className = '',
    height = 'h-4',
    width = 'w-full',
    rounded = 'rounded'
}: {
    className?: string;
    height?: string;
    width?: string;
    rounded?: string;
}) {
    return (
        <div className={`${height} ${width} ${rounded} bg-gray-200 animate-pulse ${className}`}></div>
    );
}

/**
 * A card skeleton for loading card items
 */
export function CardSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 ${className}`}>
            <div className="aspect-video bg-gray-200 animate-pulse"></div>
            <div className="p-4">
                <SkeletonLoader className="mb-3" height="h-5" width="w-3/4" />
                <SkeletonLoader className="mb-3" height="h-4" />
                <SkeletonLoader height="h-3" width="w-1/3" />
            </div>
        </div>
    );
}

/**
 * A grid of card skeletons for loading card grids
 */
export function CardGridSkeleton({
    count = 6,
    columns = 3,
    className = ''
}: {
    count?: number;
    columns?: number;
    className?: string;
}) {
    return (
        <div
            className={`grid gap-3 xs:gap-4 sm:gap-5 lg:gap-6 ${className}`}
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
            }}
        >
            {Array.from({ length: count }).map((_, index) => (
                <CardSkeleton key={index} />
            ))}
        </div>
    );
}
