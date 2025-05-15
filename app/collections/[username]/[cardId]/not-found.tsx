'use client';

import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useParams } from 'next/navigation';

export default function NotFound() {
    // We can access params in not-found component
    const params = useParams();
    const username = params.username as string;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    href={`/collections/${username}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Collection
                </Link>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <AlertTriangle className="h-16 w-16 text-amber-500 dark:text-amber-400" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Card Not Found</h1>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        The card you're looking for doesn't exist or may have been removed.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={`/collections/${username}`}>
                            <Button variant="default">
                                View Collection
                            </Button>
                        </Link>

                        <Link href="/">
                            <Button variant="outline">
                                Go to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
