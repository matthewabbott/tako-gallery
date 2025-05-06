import Link from 'next/link'

export default function Home() {
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Tako Gallery</h1>
                <p className="text-lg text-gray-600 mb-8">
                    Create and share collections of data visualizations using the Tako Knowledge Search API
                </p>
                <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                    <p className="text-gray-700 mb-4">
                        Welcome to Tako Gallery! This application allows you to:
                    </p>
                    <ul className="list-disc text-left pl-8 mb-6 text-gray-700">
                        <li>Generate data visualizations using the Tako Knowledge Search API</li>
                        <li>Save visualizations to your personal collection</li>
                        <li>Share your collection with others via a custom URL</li>
                    </ul>
                    <p className="text-gray-700 mb-6">
                        To get started, you&apos;ll need a Tako API key. Search functionality coming soon!
                    </p>
                </div>
            </div>
        </main>
    )
}