import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const mongoose = await connectToDatabase();
        return NextResponse.json({
            success: true,
            message: 'Connected to MongoDB',
            version: mongoose.version
        });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to connect to database' },
            { status: 500 }
        );
    }
}