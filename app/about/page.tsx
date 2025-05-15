import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-tako-dark-text-primary mb-6">About Tako Gallery</h1>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-tako-dark-text-primary mb-4">What is Tako Gallery?</h2>
                    <p className="text-gray-700 dark:text-tako-dark-text-secondary mb-4">
                        Tako Gallery is a web application that allows you to generate data visualization cards using the Tako Knowledge Search API, save them to a collection, and share these collections publicly. Each collection is associated with a unique Tako API key and a user-chosen username that serves as the URL endpoint for viewing the collection.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-tako-dark-text-primary mb-4">How It Works</h2>
                    <div className="bg-white dark:bg-tako-dark-surface rounded-lg shadow-md dark:shadow-lg p-6 mb-6">
                        <ol className="space-y-6">
                            <li className="flex">
                                <span className="bg-primary-600 dark:bg-tako-dark-accent text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">1</span>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-tako-dark-text-primary">Enter your Tako API key and query</h3>
                                    <p className="text-gray-700 dark:text-tako-dark-text-secondary">
                                        On the home page, enter your Tako API key and a natural language query describing the data visualization you want to create. For example, "Tesla stock price vs revenue over the last 5 years" or "Global CO2 emissions by country".
                                    </p>
                                </div>
                            </li>
                            <li className="flex">
                                <span className="bg-primary-600 dark:bg-tako-dark-accent text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">2</span>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-tako-dark-text-primary">Generate a visualization</h3>
                                    <p className="text-gray-700 dark:text-tako-dark-text-secondary">
                                        Click the "Generate Visualization" button to send your query to the Tako Knowledge Search API. The API will process your query and generate a data visualization card based on relevant data sources.
                                    </p>
                                </div>
                            </li>
                            <li className="flex">
                                <span className="bg-primary-600 dark:bg-tako-dark-accent text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">3</span>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-tako-dark-text-primary">Save to your collection</h3>
                                    <p className="text-gray-700 dark:text-tako-dark-text-secondary">
                                        The visualization will be automatically saved to your collection. If this is your first time using Tako Gallery with your API key, you'll be taken directly to your collection page with a temporary username. From there, you can choose a more permanent username.
                                    </p>
                                </div>
                            </li>
                            <li className="flex">
                                <span className="bg-primary-600 dark:bg-tako-dark-accent text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">4</span>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-tako-dark-text-primary">Share your collection</h3>
                                    <p className="text-gray-700 dark:text-tako-dark-text-secondary">
                                        Once your visualization is saved, you can share your collection with others via a custom URL based on your chosen username (e.g., <code className="dark:text-tako-dark-text-secondary dark:bg-tako-dark-border px-1 py-0.5 rounded">https://tako-gallery.vercel.app/collections/your-username</code>).
                                    </p>
                                </div>
                            </li>
                        </ol>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-tako-dark-text-primary mb-4">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-tako-dark-surface p-6 rounded-lg shadow-sm dark:shadow-md">
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-tako-dark-text-primary">Data Visualization Generation</h3>
                            <p className="text-gray-600 dark:text-tako-dark-text-secondary">
                                Create beautiful data visualizations using natural language queries through the Tako Knowledge Search API. No coding or data preparation required.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-tako-dark-surface p-6 rounded-lg shadow-sm dark:shadow-md">
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-tako-dark-text-primary">Collection Management</h3>
                            <p className="text-gray-600 dark:text-tako-dark-text-secondary">
                                Save visualizations to your personal collection with your Tako API key. Organize and manage your visualizations in one place.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-tako-dark-surface p-6 rounded-lg shadow-sm dark:shadow-md">
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-tako-dark-text-primary">Custom Usernames</h3>
                            <p className="text-gray-600 dark:text-tako-dark-text-secondary">
                                Choose a unique username for your collection URL, making it easy to share and remember.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-tako-dark-surface p-6 rounded-lg shadow-sm dark:shadow-md">
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-tako-dark-text-primary">Card Management</h3>
                            <p className="text-gray-600 dark:text-tako-dark-text-secondary">
                                View, search, and delete cards in your collection. Each card includes the visualization, source information, and methodology details.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-tako-dark-text-primary mb-4">Getting a Tako API Key</h2>
                    <p className="text-gray-700 dark:text-tako-dark-text-secondary mb-4">
                        To use Tako Gallery, you'll need a Tako API key. You can get one by signing up at <a href="https://trytako.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 visited:text-primary-600 dark:text-blue-400 dark:visited:text-tako-dark-accent hover:underline">trytako.com</a>.
                    </p>
                    <p className="text-gray-700 dark:text-tako-dark-text-secondary mb-4">
                        Once you have your API key, you can use it to generate visualizations and create your collection on Tako Gallery.
                    </p>
                    <div className="flex justify-center">
                        <a
                            href="https://trytako.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(buttonVariants({ variant: 'default' }))}
                        >
                            Get a Tako API Key
                        </a>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-tako-dark-text-primary mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-tako-dark-surface p-6 rounded-lg shadow-sm dark:shadow-md">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-tako-dark-text-primary">Is my Tako API key secure?</h3>
                            <p className="text-gray-700 dark:text-tako-dark-text-secondary">
                                Fairly. Your Tako API key is hashed before being stored in our database. We never store the raw API key, only a SHA256 hash that allows us to verify your requests. This hash is unsalted, however, as your API key essentially *is* your identity in the app. Please understand, I wanted to keep it stateless (aside from just a tiny bit of session, as a treat for me, you know how it is).
                            </p>
                        </div>

                        <div className="bg-white dark:bg-tako-dark-surface p-6 rounded-lg shadow-sm dark:shadow-md">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-tako-dark-text-primary">Can I update my username?</h3>
                            <p className="text-gray-700 dark:text-tako-dark-text-secondary">
                                Indeed, you can update your username at any time by clicking the "Change Username" button on your collection page. You'll need to provide your Tako API key and choose a new username that isn't already taken.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-tako-dark-surface p-6 rounded-lg shadow-sm dark:shadow-md">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-tako-dark-text-primary">How do I create a new card?</h3>
                            <p className="text-gray-700 dark:text-tako-dark-text-secondary">
                                To create a new card, go to your collection page and click the "New Card" button. You'll need to provide your Tako API key and enter a natural language query to generate a new visualization.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-tako-dark-surface p-6 rounded-lg shadow-sm dark:shadow-md">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-tako-dark-text-primary">How do I delete a card from my collection?</h3>
                            <p className="text-gray-700 dark:text-tako-dark-text-secondary">
                                To delete a card, navigate to the card's detail page in your collection and click the "Delete Card" button. You'll need to provide your Tako API key to confirm the deletion.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-tako-dark-surface p-6 rounded-lg shadow-sm dark:shadow-md">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-tako-dark-text-primary">Are my collections public?</h3>
                            <p className="text-gray-700 dark:text-tako-dark-text-secondary">
                                Indeed, all collections are public and can be viewed by anyone with the collection URL. However, only you (with your Tako API key) can add or delete cards from your collection. If you lose your API key, that collection and username will stand immutable forever more (or until I implement some sort of cleanup).
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-tako-dark-text-primary mb-4">About the Project</h2>
                    <p className="text-gray-700 dark:text-tako-dark-text-secondary mb-4">
                        Tako Gallery was created as a showcase application for the Tako Knowledge Search API. It demonstrates how the API can be used to generate data visualizations from natural language queries and how these visualizations can be organized and shared.
                    </p>
                    <p className="text-gray-700 dark:text-tako-dark-text-secondary mb-4">
                        The project is open source and available on <a href="https://github.com/matthewabbott/tako-gallery" target="_blank" rel="noopener noreferrer" className="text-blue-600 visited:text-primary-600 dark:text-blue-400 dark:visited:text-tako-dark-accent hover:underline">GitHub</a>
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            href="/"
                            className={cn(buttonVariants({ variant: 'default' }))}
                        >
                            Try It Now
                        </Link>
                        <a
                            href="https://github.com/matthewabbott/tako-gallery"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(buttonVariants({ variant: 'outline' }))}
                        >
                            View on GitHub
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
