'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UsernameForm } from '@/components/UsernameForm';

export default function NewCollectionPage() {
    const router = useRouter();

    // Check if API key exists in session storage
    useEffect(() => {
        const apiKey = sessionStorage.getItem('takoApiKey');
        if (!apiKey) {
            // If no API key is found, redirect to home page
            router.push('/');
        }
    }, [router]);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto">
                <UsernameForm />
            </div>
        </div>
    );
}