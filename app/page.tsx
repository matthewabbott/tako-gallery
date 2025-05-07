// app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 md:text-5xl">
                    Tako Gallery
                </h1>
                <p className="text-lg text-gray-600 mb-8 md:text-xl">
                    Create and share collections of data visualizations using the Tako Knowledge Search API
                </p>

                <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                    <p className="text-gray-700 mb-6">
                        Welcome to Tako Gallery! This application allows you to generate data visualizations
                        using the Tako Knowledge Search API, save them to your personal collection, and share
                        your collection with others via a custom URL.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            as={Link}
                            href="/search"
                            size="lg"
                        >
                            Create Visualization
                        </Button>
                        <Button
                            as={Link}
                            href="/explore"
                            variant="outline"
                            size="lg"
                        >
                            Explore Collections
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-3">Generate</h2>
                        <p className="text-gray-600">
                            Use the Tako Knowledge Search API to generate data visualizations from natural language queries.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-3">Save</h2>
                        <p className="text-gray-600">
                            Save your visualizations to your personal collection with your Tako API key.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-3">Share</h2>
                        <p className="text-gray-600">
                            Share your collection with others via a custom URL based on your chosen username.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}