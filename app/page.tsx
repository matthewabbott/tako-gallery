import Link from 'next/link';
import { SearchForm } from '@/components/SearchForm';
import { FindCollectionForm } from '@/components/FindCollectionForm';
import { Button } from '@/components/ui/Button';

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-tako-dark-text-primary mb-4 md:text-5xl">
                        Tako Gallery
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-tako-dark-text-secondary md:text-xl">
                        Create and share collections of data visualizations using the Tako Knowledge Search API
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
                    <div className="lg:col-span-3 space-y-8">
                        <SearchForm />
                        <FindCollectionForm />
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-tako-dark-surface rounded-lg shadow-md dark:shadow-lg p-6 h-full">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-tako-dark-text-primary">How It Works</h2>

                            <ol className="space-y-4 mb-6">
                                <li className="flex">
                                    <span className="bg-blue-600 dark:bg-tako-dark-accent text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                                    <p className="text-gray-700 dark:text-tako-dark-text-secondary">Enter your Tako API key and a natural language query</p>
                                </li>
                                <li className="flex">
                                    <span className="bg-blue-600 dark:bg-tako-dark-accent text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                                    <p className="text-gray-700 dark:text-tako-dark-text-secondary">Generate a data visualization from the Tako Knowledge Search API</p>
                                </li>
                                <li className="flex">
                                    <span className="bg-blue-600 dark:bg-tako-dark-accent text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                                    <p className="text-gray-700 dark:text-tako-dark-text-secondary">Save the visualization to your collection</p>
                                </li>
                                <li className="flex">
                                    <span className="bg-blue-600 dark:bg-tako-dark-accent text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                                    <p className="text-gray-700 dark:text-tako-dark-text-secondary">Share your collection with others via a custom URL</p>
                                </li>
                            </ol>

                            <Link href="/explore" className="w-full">
                                <Button
                                    variant="outline"
                                    fullWidth
                                >
                                    Explore Collections
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-tako-dark-surface p-6 rounded-lg shadow-sm dark:shadow-md">
                        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-tako-dark-text-primary">Generate</h2>
                        <p className="text-gray-600 dark:text-tako-dark-text-secondary">
                            Use the Tako Knowledge Search API to generate data visualizations from natural language queries.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-tako-dark-surface p-6 rounded-lg shadow-sm dark:shadow-md">
                        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-tako-dark-text-primary">Save</h2>
                        <p className="text-gray-600 dark:text-tako-dark-text-secondary">
                            Save your visualizations to your personal collection with your Tako API key.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-tako-dark-surface p-6 rounded-lg shadow-sm dark:shadow-md">
                        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-tako-dark-text-primary">Share</h2>
                        <p className="text-gray-600 dark:text-tako-dark-text-secondary">
                            Share your collection with others via a custom URL based on your chosen username.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
