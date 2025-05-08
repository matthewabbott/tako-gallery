import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">About Tako Gallery</h1>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">What is Tako Gallery?</h2>
                    <p className="text-gray-700 mb-4">
                        Tako Gallery is a web application that allows you to generate data visualization cards using the Tako Knowledge Search API, save them to a collection, and share these collections publicly. Each collection is associated with a unique Tako API key and a user-chosen username that serves as the URL endpoint for viewing the collection.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Whether you&apos;re a data analyst looking to share insights, a researcher visualizing findings, or just curious about data, Tako Gallery provides an easy way to create, organize, and share beautiful data visualizations.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <ol className="space-y-6">
                            <li className="flex">
                                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">1</span>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Enter your Tako API key and query</h3>
                                    <p className="text-gray-700">
                                        On the home page, enter your Tako API key and a natural language query describing the data visualization you want to create. For example, &quot;Tesla stock price vs revenue over the last 5 years&quot; or &quot;Global CO2 emissions by country&quot;.
                                    </p>
                                </div>
                            </li>
                            <li className="flex">
                                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">2</span>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Generate a visualization</h3>
                                    <p className="text-gray-700">
                                        Click the &quot;Generate Visualization&quot; button to send your query to the Tako Knowledge Search API. The API will process your query and generate a data visualization card based on relevant data sources.
                                    </p>
                                </div>
                            </li>
                            <li className="flex">
                                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">3</span>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Save to your collection</h3>
                                    <p className="text-gray-700">
                                        The visualization will be automatically saved to your collection. If this is your first time using Tako Gallery with your API key, you&apos;ll be prompted to choose a username for your collection.
                                    </p>
                                </div>
                            </li>
                            <li className="flex">
                                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">4</span>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Share your collection</h3>
                                    <p className="text-gray-700">
                                        Once your visualization is saved, you can share your collection with others via a custom URL based on your chosen username (e.g., <code>https://tako-gallery.vercel.app/collections/your-username</code>).
                                    </p>
                                </div>
                            </li>
                        </ol>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-3">Data Visualization Generation</h3>
                            <p className="text-gray-600">
                                Create beautiful data visualizations using natural language queries through the Tako Knowledge Search API. No coding or data preparation required.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-3">Collection Management</h3>
                            <p className="text-gray-600">
                                Save visualizations to your personal collection with your Tako API key. Organize and manage your visualizations in one place.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-3">Custom Usernames</h3>
                            <p className="text-gray-600">
                                Choose a unique username for your collection URL, making it easy to share and remember.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-3">Card Management</h3>
                            <p className="text-gray-600">
                                View, search, and delete cards in your collection. Each card includes the visualization, source information, and methodology details.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Getting a Tako API Key</h2>
                    <p className="text-gray-700 mb-4">
                        To use Tako Gallery, you&apos;ll need a Tako API key. You can get one by signing up at <a href="https://trytako.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">trytako.com</a>.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Once you have your API key, you can use it to generate visualizations and create your collection on Tako Gallery.
                    </p>
                    <div className="flex justify-center">
                        <a
                            href="https://trytako.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 h-10 py-2 px-4"
                        >
                            Get a Tako API Key
                        </a>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-2">Is my Tako API key secure?</h3>
                            <p className="text-gray-700">
                                Fairly. Your Tako API key is hashed before being stored in our database. We never store the raw API key, only a secure hash that allows us to verify your identity when you make requests. This hash is unsalted, however, as your API key essentially *is* your identity in the app. Please understand, I wanted to keep it stateless, you know how it is.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-2">Can I update my username?</h3>
                            <p className="text-gray-700">
                                Yes, you can update your username at any time by visiting the &quot;Update Username&quot; page. You&apos;ll need to provide your Tako API key and choose a new username that isn&apos;t already taken.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-2">How do I delete a card from my collection?</h3>
                            <p className="text-gray-700">
                                To delete a card, navigate to the card&apos;s detail page in your collection and click the &quot;Delete Card&quot; button. You&apos;ll need to provide your Tako API key to confirm the deletion.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-2">Are my collections public?</h3>
                            <p className="text-gray-700">
                                Yes, all collections are public and can be viewed by anyone with the collection URL. However, only you (with your Tako API key) can add or delete cards from your collection.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">About the Project</h2>
                    <p className="text-gray-700 mb-4">
                        Tako Gallery was created as a showcase application for the Tako Knowledge Search API. It demonstrates how the API can be used to generate data visualizations from natural language queries and how these visualizations can be organized and shared.
                    </p>
                    <p className="text-gray-700 mb-4">
                        The project is open source and available on <a href="https://github.com/matthewabbott/tako-gallery" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 h-10 py-2 px-4"
                        >
                            Try It Now
                        </Link>
                        <a
                            href="https://github.com/matthewabbott/tako-gallery"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-400 h-10 py-2 px-4"
                        >
                            View on GitHub
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
