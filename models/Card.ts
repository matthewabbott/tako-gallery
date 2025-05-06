import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
    apiKeyHash: string;
    cardId: string;
    title: string;
    description: string;
    webpageUrl: string;
    imageUrl: string;
    embedUrl: string;
    sources: Array<{
        source_name: string;
        source_description: string;
        source_index: string;
        url: string;
    }>;
    methodologies: Array<{
        methodology_name: string;
        methodology_description: string;
    }>;
    sourceIndexes: string[];
    query: string;
    createdAt: Date;
}

const CardSchema: Schema = new Schema({
    apiKeyHash: {
        type: String,
        required: true,
        index: true,
    },
    cardId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    webpageUrl: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    embedUrl: {
        type: String,
        required: true,
    },
    sources: [{
        source_name: String,
        source_description: String,
        source_index: String,
        url: String,
    }],
    methodologies: [{
        methodology_name: String,
        methodology_description: String,
    }],
    sourceIndexes: [String],
    query: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create indexes for efficient queries
CardSchema.index({ apiKeyHash: 1, createdAt: -1 });

// Create the model only if it doesn't exist already
export const Card = mongoose.models.Card || mongoose.model<ICard>('Card', CardSchema);