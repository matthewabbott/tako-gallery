'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { ErrorDisplay } from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/LoadingState';

interface CreateCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
}

export function CreateCardModal({ isOpen, onClose, username }: CreateCardModalProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [showApiKey, setShowApiKey] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [query]);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // Prevent scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    // Handle clicks outside the modal to close it
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!apiKey || !query) {
            setError('API key and query are required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    apiKey,
                    query,
                    username // Pass username to validate API key against collection
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred while creating the card');
            }

            // Store API key in session storage
            sessionStorage.setItem('takoApiKey', apiKey);

            // Update the URL with the new card ID
            const cardId = data.data.card.cardId;

            // Create a URL with the cardId parameter
            const url = `${pathname}?cardId=${cardId}`;

            // Close the modal
            onClose();

            // Navigate to the URL with the card ID
            router.push(url);
        } catch (error) {
            console.error('Card creation error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Create New Card</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                                Tako API Key
                            </label>
                            <div className="relative">
                                <Input
                                    id="apiKey"
                                    type={showApiKey ? 'text' : 'password'}
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter your Tako API key"
                                    fullWidth
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                >
                                    {showApiKey ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                This must match the API key associated with this collection.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                                Search Query
                            </label>
                            <textarea
                                ref={textareaRef}
                                id="query"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g., Tesla stock price vs revenue"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                rows={3}
                                style={{ minHeight: '100px', resize: 'vertical' }}
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Enter a natural language query to generate a data visualization.
                            </p>
                        </div>

                        {error && (
                            <div className="mt-4">
                                <ErrorDisplay error={error} />
                            </div>
                        )}
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t flex justify-end gap-2">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        type="button"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        type="submit"
                    >
                        <Search className="mr-2 h-4 w-4" />
                        Generate Card
                    </Button>
                </div>
            </div>
        </div>
    );
}
