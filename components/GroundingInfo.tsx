'use client';

import { ExternalLink } from 'lucide-react';
import { Card } from '@/hooks/useCards';

interface GroundingInfoProps {
    card: Card;
}

export function GroundingInfo({ card }: GroundingInfoProps) {
    return (
        <div className="space-y-4">
            {/* Description */}
            <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700">{card.description}</p>
            </div>

            {/* Sources */}
            {card.sources && card.sources.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-semibold mb-2">Sources</h3>
                    <div className="space-y-3">
                        {card.sources.map((source, index) => (
                            <div key={index} className="text-sm">
                                <div className="font-medium">{source.source_name}</div>
                                <p className="text-gray-700">{source.source_description}</p>
                                {source.url && (
                                    <a
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center mt-1"
                                    >
                                        <span>View Source</span>
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Methodologies */}
            {card.methodologies && card.methodologies.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-semibold mb-2">Methodologies</h3>
                    <div className="space-y-3">
                        {card.methodologies.map((methodology, index) => (
                            <div key={index} className="text-sm">
                                <div className="font-medium">{methodology.methodology_name}</div>
                                <p className="text-gray-700">{methodology.methodology_description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Source Indexes */}
            {card.sourceIndexes && card.sourceIndexes.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-semibold mb-2">Source Indexes</h3>
                    <div className="flex flex-wrap gap-2">
                        {card.sourceIndexes.map((index, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-200 rounded text-xs">
                                {index}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
