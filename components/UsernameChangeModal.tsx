'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useUsername } from '@/hooks/useUsername';
import { ErrorDisplay } from '@/components/ErrorBoundary';

interface UsernameChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    highlightMode?: boolean;
}

export function UsernameChangeModal({ isOpen, onClose, highlightMode = false }: UsernameChangeModalProps) {
    const [storedApiKey, setStoredApiKey] = useState<string | null>(null);

    const router = useRouter();

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
    } = useUsername({
        onSuccess: (username, collectionUrl) => {
            // Close the modal after successful username change
            onClose();

            // Redirect to the new collection URL
            router.push(`/collections/${username}`);
        }
    });

    // Get API key from session storage if available
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const key = sessionStorage.getItem('takoApiKey');
            if (key) {
                setStoredApiKey(key);
                setApiKey(key);
            }
        }
    }, [setApiKey]);

    // If the modal is not open, don't render anything
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-tako-dark-surface rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-tako-dark-border">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-tako-dark-text-primary">Change Username</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-tako-dark-text-secondary dark:hover:text-tako-dark-text-primary"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="mb-6 text-gray-600 dark:text-tako-dark-text-secondary">
                        Choose a new username for your collection. This will update the URL for your collection page.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                disabled={isLoading}
                            />
                            {storedApiKey && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-tako-dark-text-secondary">
                                    Using API key from your current session.
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-tako-dark-text-primary mb-1">
                                New Username
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
                                    disabled={isLoading}
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

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                                fullWidth
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                disabled={!isAvailable || isLoading}
                                fullWidth
                            >
                                Update Username
                            </Button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-6">
                            <ErrorDisplay error={error} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
