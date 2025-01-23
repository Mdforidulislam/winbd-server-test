import mongoose from 'mongoose';


// Define the transaction schema
const transactionSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        index: true,
        trim: true,
        lowercase: true
    },
    transactionType: {
        type: String,
        required: true,
        trim: true
    },
    transactionImage: {
        type: String,
        trim: true
    },
    transactionId: {
        type: String,
        trim: true,
        unique: true,
        index: true,
        required: false,
    },
    paymentMethod: {
        type: String,
        trim: true
    },
    paymentChannel: {
        type: String,
        trim: true
    },
    userNumber: {
        type: String,
        required: false,
        trim: true
    },
    authoreNumber: {
        type: String,
        required: false,
        trim: true
    },
    authorId: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    isAutoPay: {
        type: Boolean,
        default: false
    },
    requestStatus: {
        type: String,
        default: 'Processing',
        trim: true
    },
    statusNote: {
        type: String,
        default: "On Processing request",
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
        expires: 7 * 24 * 60 * 60 // 7 days in seconds
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

// Compound index for authorId and createdAt for performance optimization
transactionSchema.index({ authorId: 1, createdAt: -1 });

const Transactions = mongoose.model('Transactions', transactionSchema);

export { Transactions };
