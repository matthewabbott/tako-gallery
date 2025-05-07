'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, Github } from 'lucide-react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-blue-600">Tako Gallery</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/explore"
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            Explore
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            About
                        </Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/search"
                            className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </Link>
                        <Link
                            href="https://github.com/yourusername/tako-gallery"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                            aria-label="GitHub Repository"
                        >
                            <Github size={20} />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/explore"
                                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Explore
                            </Link>
                            <Link
                                href="/about"
                                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/search"
                                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Search
                            </Link>
                            <Link
                                href="https://github.com/yourusername/tako-gallery"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                GitHub Repository
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}