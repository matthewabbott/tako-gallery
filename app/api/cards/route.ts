import { NextResponse } from 'next/server';
import {
    connectToDatabase,
    getCachedData,
    cacheData,
    generateCacheKey
} from '@/lib/mongodb';
import { User } from '@/models/User';
import { Card } from '@/models/Card';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';
import { handleApiError } from '@/lib/error';

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

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
        const fields = searchParams.get('fields') || '';

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

        // Generate cache key
        const cacheKey = generateCacheKey('cards', {
            username,
            page,
            limit,
            search,
            sortBy,
            sortOrder,
            sourceFilter,
            sourceIndexFilter,
            methodologyFilter,
            fields
        });

        // Try to get data from cache
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
            // Return cached data with cache header
            const response = NextResponse.json(
                createSuccessResponse(cachedData)
            );

            // Add cache control headers
            response.headers.set('Cache-Control', 'public, max-age=300');
            response.headers.set('X-Cache', 'HIT');

            return response;
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

        // Parse fields to include in response (if specified)
        const fieldSelection: Record<string, number> | null = fields ?
            fields.split(',').reduce((acc, field) => ({ ...acc, [field.trim()]: 1 }), {} as Record<string, number>) :
            null;

        // Handle special sorting cases
        let cards;
        if (sortBy === 'sourcesCount' || sortBy === 'methodologiesCount') {
            // Use aggregation for array length sorting
            const arrayField = sortBy === 'sourcesCount' ? 'sources' : 'methodologies';

            // Use aggregation for array length sorting with proper typing
            const aggregationPipeline: any[] = [
                { $match: query },
                {
                    $addFields: {
                        arrayLength: { $size: { $ifNull: [`$${arrayField}`, []] } }
                    }
                },
                { $sort: { arrayLength: sortDirection } },
                { $skip: skip },
                { $limit: limit }
            ];

            // Add projection if fields are specified
            if (fieldSelection) {
                aggregationPipeline.push({ $project: fieldSelection });
            }

            cards = await Card.aggregate(aggregationPipeline);
        } else {
            // Build sort object for regular sorting
            const sort: any = {};
            sort[sortBy] = sortDirection;

            // Get cards with pagination and regular sorting
            let findQuery = Card.find(query);

            // Apply field selection if specified
            if (fieldSelection) {
                findQuery = findQuery.select(fieldSelection);
            }

            cards = await findQuery
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(); // Use lean for better performance
        }

        // Calculate total pages
        const totalPages = Math.ceil(totalCards / limit);

        // Format cards for response - only include requested fields or all if not specified
        const formattedCards = cards.map(card => {
            // Use proper typing for the card object
            const baseCard: Record<string, any> = {
                id: card._id ? card._id.toString() : card.id,
                cardId: card.cardId,
                title: card.title,
                createdAt: card.createdAt,
            };

            // Only add other fields if they exist in the result (based on field selection)
            if ((!fieldSelection || 'description' in fieldSelection) && card.description)
                baseCard.description = card.description;
            if ((!fieldSelection || 'webpageUrl' in fieldSelection) && card.webpageUrl)
                baseCard.webpageUrl = card.webpageUrl;
            if ((!fieldSelection || 'imageUrl' in fieldSelection) && card.imageUrl)
                baseCard.imageUrl = card.imageUrl;
            if ((!fieldSelection || 'embedUrl' in fieldSelection) && card.embedUrl)
                baseCard.embedUrl = card.embedUrl;
            if ((!fieldSelection || 'sources' in fieldSelection) && card.sources)
                baseCard.sources = card.sources;
            if ((!fieldSelection || 'methodologies' in fieldSelection) && card.methodologies)
                baseCard.methodologies = card.methodologies;
            if ((!fieldSelection || 'sourceIndexes' in fieldSelection) && card.sourceIndexes)
                baseCard.sourceIndexes = card.sourceIndexes;
            if ((!fieldSelection || 'query' in fieldSelection) && card.query)
                baseCard.query = card.query;

            return baseCard;
        });

        // Prepare response data
        const responseData = {
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
        };

        // Cache the response
        cacheData(cacheKey, responseData, CACHE_TTL);

        // Create response with cache headers
        const response = NextResponse.json(
            createSuccessResponse(responseData)
        );

        // Add cache control headers
        response.headers.set('Cache-Control', 'public, max-age=300');
        response.headers.set('X-Cache', 'MISS');
        response.headers.set('ETag', `W/"${Date.now().toString(36)}"`);

        return response;
    } catch (error) {
        console.error('Cards API error:', error);
        return handleApiError(error, 'An error occurred while retrieving cards');
    }
}
