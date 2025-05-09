'use client';

import { useState, useEffect } from 'react';
import { Share2, Calendar, Grid, PenLine, Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { formatDate } from '@/lib/utils';
import { UsernameChangeModal } from './UsernameChangeModal';
import { NewCardModal } from './NewCardModal';
import { NewUserModal } from './NewUserModal';
import { clearPagesGlobalCache } from '@/hooks/usePreloadCache';

interface CollectionHeaderProps {
    username: string;
    createdAt: string;
    cardCount: number;
    isTemporaryUsername?: boolean;
    apiKey?: string;
}

export function CollectionHeader({
    username,
    createdAt,
    cardCount,
    isTemporaryUsername = false,
    apiKey = ''
}: CollectionHeaderProps) {
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [showNewCardModal, setShowNewCardModal] = useState(false);
    const [showNewUserModal, setShowNewUserModal] = useState(isTemporaryUsername);

    const shareCollection = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        // Could add a toast notification here
        alert('Collection URL copied to clipboard!');
    };

    const handleNewCardSuccess = () => {
        // Clear the pages cache to force a fresh fetch
        clearPagesGlobalCache();

        // Reload the page to show the new card
        // Using a small delay to ensure cache is cleared first
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{username}&apos;s Collection</h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-600">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Created {formatDate(createdAt)}</span>
                            </div>
                            <div className="flex items-center">
                                <Grid className="h-4 w-4 mr-2" />
                                <span>{cardCount} {cardCount === 1 ? 'card' : 'cards'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
                        <Button
                            onClick={() => setShowNewCardModal(true)}
                            variant="default"
                            className="flex items-center"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            New Card
                        </Button>
                        <Button
                            onClick={() => setShowUsernameModal(true)}
                            variant="outline"
                            className="flex items-center"
                        >
                            <PenLine className="h-4 w-4 mr-2" />
                            Change Username
                        </Button>
                        <Button
                            onClick={shareCollection}
                            variant="outline"
                            className="flex items-center"
                        >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <UsernameChangeModal
                isOpen={showUsernameModal}
                onClose={() => setShowUsernameModal(false)}
                currentUsername={username}
            />

            <NewCardModal
                isOpen={showNewCardModal}
                onClose={() => setShowNewCardModal(false)}
                username={username}
                onSuccess={handleNewCardSuccess}
            />

            {isTemporaryUsername && apiKey && (
                <NewUserModal
                    isOpen={showNewUserModal}
                    onClose={() => setShowNewUserModal(false)}
                    apiKey={apiKey}
                    currentUsername={username}
                />
            )}
        </>
    );
}
