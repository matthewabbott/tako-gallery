import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Card } from '@/models/Card';
import { hashApiKey, isValidApiKeyFormat, verifyApiKey } from '@/lib/apiKey';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';
import { handleApiError } from '@/lib/error';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cardId = params.id;

        // Get API key from request body
        const body = await request.json();
        const { apiKey } = body;

        // Validate API key
        if (!apiKey || !isValidApiKeyFormat(apiKey)) {
            return NextResponse.json(
                createErrorResponse('Invalid API key format'),
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Find the card
        const card = await Card.findOne({ cardId });

        if (!card) {
            return NextResponse.json(
                createErrorResponse('Card not found'),
                { status: 404 }
            );
        }

        // Hash the API key for verification
        const apiKeyHash = await hashApiKey(apiKey);

        // Verify that the API key matches the card's API key hash
        if (apiKeyHash !== card.apiKeyHash) {
            return NextResponse.json(
                createErrorResponse('You are not authorized to delete this card'),
                { status: 403 }
            );
        }

        // Delete the card
        await Card.deleteOne({ _id: card._id });

        // Return success response
        return NextResponse.json(
            createSuccessResponse({
                message: 'Card deleted successfully',
                cardId: card.cardId,
            })
        );
    } catch (error) {
        console.error('Delete card API error:', error);
        return handleApiError(error, 'An error occurred while deleting the card');
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cardId = params.id;

        // Connect to database
        await connectToDatabase();

        // Find the card
        const card = await Card.findOne({ cardId });

        if (!card) {
            return NextResponse.json(
                createErrorResponse('Card not found'),
                { status: 404 }
            );
        }

        // Return the card
        return NextResponse.json(
            createSuccessResponse({
                card: {
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
                },
            })
        );
    } catch (error) {
        console.error('Get card API error:', error);
        return handleApiError(error, 'An error occurred while retrieving the card');
    }
}