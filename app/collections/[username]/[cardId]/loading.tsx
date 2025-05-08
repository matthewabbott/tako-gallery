import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Loading() {
    // We can't access the params in a loading component,
    // so we'll use a generic back link that will be replaced when the page loads
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/collections"
                    className="inline-flex items-center text-blue-600 hover:underline mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Collections
                </Link>

                <div className="animate-pulse">
                    {/* Title Skeleton */}
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>

                    {/* Metadata Skeleton */}
                    <div className="flex gap-4 mb-6">
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>

                    {/* Card Iframe Skeleton */}
                    <div className="aspect-video bg-gray-200 rounded mb-6"></div>

                    {/* Buttons Skeleton */}
                    <div className="flex mb-6">
                        <div className="h-10 bg-gray-200 rounded w-40"></div>
                        <div className="h-10 bg-gray-200 rounded w-40 ml-4"></div>
                    </div>

                    {/* Grounding Info Skeleton (optional) */}
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-100 rounded-md">
                            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
