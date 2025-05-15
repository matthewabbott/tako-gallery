'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * A React Error Boundary component that catches JavaScript errors in its child component tree
 * and displays a fallback UI instead of crashing the whole application.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // You can log the error to an error reporting service
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    resetErrorBoundary = (): void => {
        if (this.props.onReset) {
            this.props.onReset();
        }
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <ErrorDisplay
                    error={this.state.error || new Error('An unknown error occurred')}
                    reset={this.resetErrorBoundary}
                />
            );
        }

        return this.props.children;
    }
}

/**
 * A reusable error display component that shows error details and provides a reset button
 */
export function ErrorDisplay({
    error,
    reset,
    fullPage = false,
    className = ''
}: {
    error: Error | string;
    reset?: () => void;
    fullPage?: boolean;
    className?: string;
}) {
    const errorMessage = typeof error === 'string' ? error : error.message || 'An unknown error occurred';

    const content = (
        <div className={`bg-red-50 dark:bg-tako-dark-surface border border-red-200 dark:border-red-500 rounded-lg p-4 sm:p-6 ${className}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm sm:text-base font-medium text-red-800 dark:text-red-400">Something went wrong</h3>
                    <div className="mt-2 text-sm sm:text-base text-red-700 dark:text-red-500">
                        <p>{errorMessage}</p>
                    </div>
                    {reset && (
                        <div className="mt-4">
                            <Button
                                type="button"
                                onClick={reset}
                                variant="outline"
                                className="text-red-800 bg-red-50 hover:bg-red-100 border-red-300 dark:text-red-400 dark:bg-tako-dark-surface dark:border-red-500 dark:hover:bg-red-500 dark:hover:text-white"
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Try again
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (fullPage) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    {content}
                </div>
            </div>
        );
    }

    return content;
}
