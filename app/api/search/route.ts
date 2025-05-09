import { NextResponse } from 'next/server';
import { searchKnowledge } from '@/lib/tako-api';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Card } from '@/models/Card';
import { hashApiKey, isValidApiKeyFormat } from '@/lib/apiKey';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';
import { handleApiError } from '@/lib/error';
import { TakoKnowledgeCard } from '@/lib/types';

export async function POST(request: Request) {
    try {
        // Parse request body
        const body = await request.json();
        const { apiKey, query } = body;

        // Validate inputs
        if (!apiKey || !isValidApiKeyFormat(apiKey)) {
            return NextResponse.json(
                createErrorResponse('Invalid API key format'),
                { status: 400 }
            );
        }

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return NextResponse.json(
                createErrorResponse('Query is required'),
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Hash the API key for database lookup
        const apiKeyHash = await hashApiKey(apiKey);

        // Execute Tako API search
        let searchResult;
        try {
            searchResult = await searchKnowledge(apiKey, query);
        } catch (error) {
            return handleApiError(error, 'Error searching Tako API');
        }

        // Check if we got any results
        if (!searchResult.outputs?.knowledge_cards?.length) {
            return NextResponse.json(
                createErrorResponse('No results found for your query'),
                { status: 404 }
            );
        }

        // Get the first card from the results
        const knowledgeCard = searchResult.outputs.knowledge_cards[0];

        // Check if user exists in database
        let user = await User.findOne({ apiKeyHash });
        let isNewUser = false;

        if (!user) {
            // This is a new user (first time using this API key)
            isNewUser = true;

            // Generate a more user-friendly auto-username
            // Use a combination of 'tako' + adjective + noun + random number
            const adjectives = ['curious', 'bright', 'clever', 'swift', 'keen', 'quick', 'smart', 'sharp'];
            const nouns = ['explorer', 'finder', 'seeker', 'analyst', 'scholar', 'researcher', 'thinker', 'creator'];

            const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
            const randomNum = Math.floor(Math.random() * 1000);

            const autoUsername = `tako_${randomAdjective}_${randomNoun}${randomNum}`;

            // Create a new user
            user = new User({
                apiKeyHash,
                username: autoUsername,
                createdAt: new Date(),
            });

            await user.save();
        }

        // Save the card to the database
        const card = await saveCardToDatabase(apiKeyHash, knowledgeCard, query);

        // Return the response
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
                collection: {
                    username: user.username,
                    isNewUser,
                },
            })
        );
    } catch (error) {
        console.error('Search API error:', error);

        return NextResponse.json(
            createErrorResponse('An error occurred while processing your request'),
            { status: 500 }
        );
    }
}

/**
 * Save a Tako knowledge card to the database
 * @param apiKeyHash The hashed API key
 * @param knowledgeCard The Tako knowledge card
 * @param query The original search query
 * @returns The saved card document
 */
async function saveCardToDatabase(
    apiKeyHash: string,
    knowledgeCard: TakoKnowledgeCard,
    query: string
) {
    // Check if the card already exists
    let card = await Card.findOne({ cardId: knowledgeCard.card_id });

    if (card) {
        // If the card exists but is associated with a different API key,
        // we'll create a new card for this API key
        if (card.apiKeyHash !== apiKeyHash) {
            card = null;
        } else {
            // Card already exists for this API key, return it
            return card;
        }
    }

    // Create a new card
    card = new Card({
        apiKeyHash,
        cardId: knowledgeCard.card_id,
        title: knowledgeCard.title,
        description: knowledgeCard.description,
        webpageUrl: knowledgeCard.webpage_url,
        imageUrl: knowledgeCard.image_url,
        embedUrl: knowledgeCard.embed_url,
        sources: knowledgeCard.sources,
        methodologies: knowledgeCard.methodologies,
        sourceIndexes: knowledgeCard.source_indexes,
        query,
        createdAt: new Date(),
    });

    await card.save();
    return card;
}
