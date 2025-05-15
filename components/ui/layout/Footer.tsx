import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 dark:bg-tako-dark-bg border-t border-gray-200 dark:border-tako-dark-border">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-tako-dark-text-primary">Tako Gallery</h3>
                        <p className="text-gray-600 dark:text-tako-dark-text-secondary mb-4">
                            A gallery of data visualizations generated from the Tako Knowledge Search API.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-tako-dark-text-primary">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-600 hover:text-blue-600 dark:text-tako-dark-text-secondary dark:hover:text-tako-dark-accent transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/explore"
                                    className="text-gray-600 hover:text-blue-600 dark:text-tako-dark-text-secondary dark:hover:text-tako-dark-accent transition-colors"
                                >
                                    Explore
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-gray-600 hover:text-blue-600 dark:text-tako-dark-text-secondary dark:hover:text-tako-dark-accent transition-colors"
                                >
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* External Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-tako-dark-text-primary">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://trytako.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-600 dark:text-tako-dark-text-secondary dark:hover:text-tako-dark-accent transition-colors"
                                >
                                    Tako
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://trytako.com/docs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-600 dark:text-tako-dark-text-secondary dark:hover:text-tako-dark-accent transition-colors"
                                >
                                    Tako API Documentation
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/matthewabbott/tako-gallery"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-600 dark:text-tako-dark-text-secondary dark:hover:text-tako-dark-accent transition-colors"
                                >
                                    GitHub Repository
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-300 dark:border-tako-dark-border mt-8 pt-8 text-center text-gray-600 dark:text-tako-dark-text-secondary">
                    <p className="mt-2 text-sm">
                        Powered by{' '}
                        <a
                            href="https://trytako.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-tako-dark-accent dark:hover:underline"
                        >
                            Tako
                        </a>
                        {' '}and{' '}
                        <a
                            href="https://vercel.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-tako-dark-accent dark:hover:underline"
                        >
                            Vercel
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
