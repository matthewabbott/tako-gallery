// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Card } from '@/models/Card';

export async function GET() {
    try {
        await connectToDatabase();

        // Get model information
        const models = {
            User: User.modelName,
            Card: Card.modelName,
        };

        return NextResponse.json({
            success: true,
            message: 'Connected to MongoDB',
            models
        });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to connect to database' },
            { status: 500 }
        );
    }
}