'use client';

import { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useUsername } from '@/hooks/useUsername';
import { ErrorDisplay } from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/LoadingState';

interface UsernameFormProps {
    className?: string;
    initialApiKey?: string;
    onSuccess?: (username: string, collectionUrl: string) => void;
}

export function UsernameForm({ className, initialApiKey, onSuccess }: UsernameFormProps) {
    const {
        apiKey,
        setApiKey,
        username,
        setUsername,
        isAvailable,
        availabilityError,
        isLoading,
        error,
        isCheckingAvailability,
        handleSubmit,
    } = useUsername({ initialApiKey, onSuccess });

    // Get API key from session storage if not provided
    useEffect(() => {
        if (!initialApiKey && typeof window !== 'undefined') {
            const storedApiKey = sessionStorage.getItem('takoApiKey');
            if (storedApiKey) {
                setApiKey(storedApiKey);
            }
        }
    }, [initialApiKey, setApiKey]);

    return (
        <div className={`bg-white dark:bg-tako-dark-surface rounded-lg shadow-md dark:shadow-lg p-6 ${className}`}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-tako-dark-text-primary">Choose Your Username</h2>

            <p className="mb-6 text-gray-600 dark:text-tako-dark-text-secondary">
                Choose a username for your collection. This will be used as the URL for your collection page.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {!initialApiKey && (
                    <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-tako-dark-text-primary mb-1">
                            Tako API Key
                        </label>
                        <Input
                            id="apiKey"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Tako API key"
                            fullWidth
                            required
                        />
                    </div>
                )}

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-tako-dark-text-primary mb-1">
                        Username
                    </label>
                    <div className="relative">
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            fullWidth
                            required
                            className={
                                isAvailable === true ? 'border-green-500 dark:border-green-400 pr-10' :
                                    isAvailable === false ? 'border-red-500 dark:border-red-500 pr-10' : ''
                            }
                        />
                        {isCheckingAvailability && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400 dark:text-gray-500" />
                            </div>
                        )}
                        {!isCheckingAvailability && isAvailable === true && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                            </div>
                        )}
                        {!isCheckingAvailability && isAvailable === false && !availabilityError && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-500" />
                            </div>
                        )}
                    </div>
                    {availabilityError && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{availabilityError}</p>
                    )}
                    {isAvailable === true && (
                        <p className="mt-1 text-sm text-green-600 dark:text-green-400">Username is available!</p>
                    )}
                    {isAvailable === false && !availabilityError && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-500">Username is already taken</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-tako-dark-text-secondary">
                        Username must be 3-30 characters long and can only contain letters, numbers, underscores, and hyphens.
                    </p>
                </div>

                <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={!isAvailable || isLoading}
                    fullWidth
                >
                    Create Collection
                </Button>
            </form>

            {error && (
                <div className="mt-6">
                    <ErrorDisplay error={error} />
                </div>
            )}
        </div>
    );
}
