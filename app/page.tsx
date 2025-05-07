import Link from 'next/link';
import { SearchForm } from '@/components/SearchForm';
import { Button } from '@/components/ui/Button';

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 md:text-5xl">
                        Tako Gallery
                    </h1>
                    <p className="text-lg text-gray-600 md:text-xl">
                        Create and share collections of data visualizations using the Tako Knowledge Search API
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
                    <div className="lg:col-span-3">
                        <SearchForm />
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6 h-full">
                            <h2 className="text-2xl font-bold mb-6">How It Works</h2>

                            <ol className="space-y-4 mb-6">
                                <li className="flex">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                                    <p>Enter your Tako API key and a natural language query</p>
                                </li>
                                <li className="flex">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                                    <p>Generate a data visualization from the Tako Knowledge Search API</p>
                                </li>
                                <li className="flex">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                                    <p>Save the visualization to your collection</p>
                                </li>
                                <li className="flex">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                                    <p>Share your collection with others via a custom URL</p>
                                </li>
                            </ol>

                            <Button
                                as={Link}
                                href="/explore"
                                variant="outline"
                                fullWidth
                            >
                                Explore Collections
                            </Button>
                        </div>
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