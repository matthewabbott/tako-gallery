import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Card } from '@/models/Card';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';
import { handleApiError } from '@/lib/error';

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

export async function GET(request: Request) {
    try {
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');
        const page = parseInt(searchParams.get('page') || `${DEFAULT_PAGE}`, 10);
        const limit = Math.min(
            parseInt(searchParams.get('limit') || `${DEFAULT_LIMIT}`, 10),
            MAX_LIMIT
        );
        const search = searchParams.get('search') || '';
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Tako-specific filters
        const sourceFilter = searchParams.get('sourceFilter') || '';
        const sourceIndexFilter = searchParams.get('sourceIndexFilter') || '';
        const methodologyFilter = searchParams.get('methodologyFilter') || '';

        // Validate username
        if (!username) {
            return NextResponse.json(
                createErrorResponse('Username is required'),
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Find user by username
        const user = await User.findOne({ username: username.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                createErrorResponse('Collection not found'),
                { status: 404 }
            );
        }

        // Build query for cards
        const query: any = { apiKeyHash: user.apiKeyHash };

        // Add search filter if provided
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { query: { $regex: search, $options: 'i' } },
            ];
        }

        // Add Tako-specific filters
        if (sourceFilter) {
            query['sources.source_name'] = { $regex: sourceFilter, $options: 'i' };
        }

        if (sourceIndexFilter) {
            query['sources.source_index'] = sourceIndexFilter;
        }

        if (methodologyFilter) {
            query['methodologies.methodology_name'] = { $regex: methodologyFilter, $options: 'i' };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Determine sort direction
        const sortDirection = sortOrder === 'asc' ? 1 : -1;

        // Get total count of cards matching the query
        const totalCards = await Card.countDocuments(query);

        // Handle special sorting cases
        let cards;
        if (sortBy === 'sourcesCount' || sortBy === 'methodologiesCount') {
            // Use aggregation for array length sorting
            const arrayField = sortBy === 'sourcesCount' ? 'sources' : 'methodologies';

            cards = await Card.aggregate([
                { $match: query },
                {
                    $addFields: {
                        arrayLength: { $size: { $ifNull: [`$${arrayField}`, []] } }
                    }
                },
                { $sort: { arrayLength: sortDirection } },
                { $skip: skip },
                { $limit: limit }
            ]);
        } else {
            // Build sort object for regular sorting
            const sort: any = {};
            sort[sortBy] = sortDirection;

            // Get cards with pagination and regular sorting
            cards = await Card.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit);
        }

        // Calculate total pages
        const totalPages = Math.ceil(totalCards / limit);

        // Format cards for response
        const formattedCards = cards.map(card => ({
            id: card._id.toString(),
            cardId: card.cardId,
            title: card.title,
            description: card.description,
            webpageUrl: card.webpageUrl,
            imageUrl: card.imageUrl,
            embedUrl: card.embedUrl,
            sources: card.sources,
            methodologies: card.methodologies,
            sourceIndexes: card.sourceIndexes,
            query: card.query,
            createdAt: card.createdAt,
        }));

        // Return the response
        return NextResponse.json(
            createSuccessResponse({
                cards: formattedCards,
                pagination: {
                    page,
                    limit,
                    totalCards,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
                collection: {
                    username: user.username,
                    createdAt: user.createdAt,
                },
            })
        );
    } catch (error) {
        console.error('Cards API error:', error);
        return handleApiError(error, 'An error occurred while retrieving cards');
    }
}
