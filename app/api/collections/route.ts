import { NextResponse } from 'next/server';

// Force dynamic rendering for this route since it uses request.url
export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Card } from '@/models/Card';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';
import { handleApiError } from '@/lib/error';

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const CARDS_PER_COLLECTION = 4;

export async function GET(request: Request) {
    try {
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || `${DEFAULT_PAGE}`, 10);
        const limit = Math.min(
            parseInt(searchParams.get('limit') || `${DEFAULT_LIMIT}`, 10),
            MAX_LIMIT
        );
        const search = searchParams.get('search') || '';
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Connect to database
        await connectToDatabase();

        // Build query for users/collections
        const query: any = {};

        // Add search filter if provided
        if (search) {
            query.username = { $regex: search, $options: 'i' };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Determine sort direction
        const sortDirection = sortOrder === 'asc' ? 1 : -1;

        // Build sort object
        const sort: any = {};
        sort[sortBy] = sortDirection;

        // Get total count of collections matching the query
        const totalCollections = await User.countDocuments(query);

        // Get collections with pagination and sorting
        const collections = await User.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Get card counts and sample cards for each collection
        const collectionsWithData = await Promise.all(
            collections.map(async (collection) => {
                const cardCount = await Card.countDocuments({ apiKeyHash: collection.apiKeyHash });

                // Get a few sample cards for this collection
                const sampleCards = await Card.find({ apiKeyHash: collection.apiKeyHash })
                    .sort({ createdAt: -1 })
                    .limit(CARDS_PER_COLLECTION);

                // Format sample cards
                const formattedCards = sampleCards.map(card => ({
                    id: card._id.toString(),
                    cardId: card.cardId,
                    title: card.title,
                    imageUrl: card.imageUrl,
                    createdAt: card.createdAt,
                }));

                return {
                    username: collection.username,
                    createdAt: collection.createdAt,
                    cardCount,
                    sampleCards: formattedCards,
                };
            })
        );

        // Calculate total pages
        const totalPages = Math.ceil(totalCollections / limit);

        // Return the response
        return NextResponse.json(
            createSuccessResponse({
                collections: collectionsWithData,
                pagination: {
                    page,
                    limit,
                    totalCollections,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            })
        );
    } catch (error) {
        console.error('Collections API error:', error);
        return handleApiError(error, 'An error occurred while retrieving collections');
    }
}
