import Image from 'next/image';
import { Calendar, Search } from 'lucide-react';
import { Card } from '@/hooks/useCards';

interface CardItemProps {
    card: Card;
    onClick: () => void;
}

export function CardItem({ card, onClick }: CardItemProps) {
    return (
        <div
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
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
    );
}