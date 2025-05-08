import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Search, ExternalLink } from 'lucide-react';
import { Card } from '@/hooks/useCards';

interface CardItemProps {
    card: Card;
    username: string;
    onClick?: () => void;
}

export function CardItem({ card, username, onClick }: CardItemProps) {
    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div className="relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            {/* Permalink icon in the corner */}
            <Link
                href={`/collections/${username}/${card.cardId}`}
                className="absolute top-2 right-2 z-10 p-1.5 bg-white bg-opacity-75 rounded-full hover:bg-opacity-100 transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <ExternalLink className="h-4 w-4 text-gray-600" />
            </Link>

            {/* Main card content that opens the modal */}
            <div
                className="cursor-pointer"
                onClick={onClick}
            >
                {/* Card Image */}
                <div className="relative aspect-video">
                    <Image
                        src={card.imageUrl || "/placeholder.svg"}
                        alt={card.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Card Content */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{card.title}</h3>

                    <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Search className="h-4 w-4 mr-1" />
                        <span className="line-clamp-1">{card.query}</span>
                    </div>

                    <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
