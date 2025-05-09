'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useDeleteCard } from '@/hooks/useDeleteCard';
import { ErrorDisplay } from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/LoadingState';
import { clearPagesGlobalCache } from '@/hooks/usePreloadCache';

interface DeleteCardProps {
    cardId: string;
    username: string;
}

export function DeleteCard({ cardId, username }: DeleteCardProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const { isDeleting, error, success, deleteCard } = useDeleteCard();
    const router = useRouter();

    const handleDelete = async () => {
        await deleteCard(cardId, apiKey);
    };

    // If deletion was successful, redirect to the collection page
    if (success) {
        // Clear the pages cache to force a fresh fetch when redirecting
        clearPagesGlobalCache();
        router.push(`/collections/${username}`);
        return null;
    }

    return (
        <div>
            {!showConfirmation ? (
                <Button
                    onClick={() => setShowConfirmation(true)}
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Card
                </Button>
            ) : (
                <div className="mt-6 p-4 border border-red-200 rounded-md bg-red-50">
                    <div className="flex items-start mb-4">
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-600">Delete this card?</h3>
                            <p className="text-sm text-gray-700 mt-1">
                                This action cannot be undone. The card will be permanently removed from your collection.
                            </p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                            Enter your API key to confirm deletion
                        </label>
                        <Input
                            id="apiKey"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Your Tako API key"
                            fullWidth
                        />
                    </div>

                    {error && (
                        <div className="mb-4">
                            <ErrorDisplay error={error} />
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            onClick={handleDelete}
                            variant="default"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting || !apiKey}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Confirm Delete'
                            )}
                        </Button>
                        <Button
                            onClick={() => setShowConfirmation(false)}
                            variant="outline"
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
