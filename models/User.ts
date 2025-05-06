import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    apiKeyHash: string;
    username: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    apiKeyHash: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        match: /^[a-zA-Z0-9_-]+$/,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the model only if it doesn't exist already
// This prevents errors during hot reloading in development
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);