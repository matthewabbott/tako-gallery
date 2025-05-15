'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DeleteCollectionModal } from '@/components/DeleteCollectionModal';

interface DeleteCollectionProps {
    username: string;
}

export function DeleteCollection({ username }: DeleteCollectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button
                onClick={openModal}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-500/70 dark:border-red-500/50 dark:hover:bg-red-500/10 dark:hover:text-red-500"
                title="Delete Collection"
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <DeleteCollectionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                username={username}
            />
        </>
    );
}
