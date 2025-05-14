'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, Github, Home, Compass, User, Info, BookOpen } from 'lucide-react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    // Handle scroll event to add shadow when scrolled
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            // Only close if clicking outside both the menu and the toggle button
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(e.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        // Use mousedown instead of click for better mobile experience
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    // Prevent body scroll when menu is open on mobile
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    return (
        <header
            className={`sticky top-0 z-50 bg-white border-b transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'
                }`}
        >
            <div className="container-responsive">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-lg xs:text-xl font-bold text-blue-600">Tako Gallery</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-blue-600 transition-colors text-sm lg:text-base"
                        >
                            Home
                        </Link>
                        <Link
                            href="/explore"
                            className="text-gray-700 hover:text-blue-600 transition-colors text-sm lg:text-base"
                        >
                            Explore
                        </Link>
                        <Link
                            href="/username"
                            className="text-gray-700 hover:text-blue-600 transition-colors text-sm lg:text-base"
                        >
                            Update Username
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-700 hover:text-blue-600 transition-colors text-sm lg:text-base"
                        >
                            About
                        </Link>
                        <Link
                            href="/making-of"
                            className="text-gray-700 hover:text-blue-600 transition-colors text-sm lg:text-base"
                        >
                            Making Of
                        </Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="https://github.com/matthewabbott/tako-gallery"
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
                        ref={menuButtonRef}
                        className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors touch-target"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - Slide down animation */}
            <div
                ref={menuRef}
                className={`md:hidden bg-white border-b shadow-sm overflow-hidden transition-all duration-300 ease-in-out relative z-45 ${isMenuOpen
                    ? 'max-h-[400px] opacity-100'
                    : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="container-responsive py-4">
                    <nav className="flex flex-col">
                        <Link
                            href="/"
                            className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors py-3 px-2 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Home size={18} className="mr-3" />
                            <span>Home</span>
                        </Link>
                        <Link
                            href="/explore"
                            className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors py-3 px-2 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Compass size={18} className="mr-3" />
                            <span>Explore</span>
                        </Link>
                        <Link
                            href="/username"
                            className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors py-3 px-2 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <User size={18} className="mr-3" />
                            <span>Update Username</span>
                        </Link>
                        <Link
                            href="/about"
                            className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors py-3 px-2 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Info size={18} className="mr-3" />
                            <span>About</span>
                        </Link>
                        <Link
                            href="/making-of"
                            className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors py-3 px-2 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <BookOpen size={18} className="mr-3" />
                            <span>Making Of</span>
                        </Link>
                        <Link
                            href="https://github.com/matthewabbott/tako-gallery"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors py-3 px-2 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Github size={18} className="mr-3" />
                            <span>GitHub Repository</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
