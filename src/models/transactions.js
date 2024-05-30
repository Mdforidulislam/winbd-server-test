const mongoose = require("mongoose");
const sendEmail = require("../lib/subadmin/email/email");

// Define the offer schema
const offerSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    offerAmount: { type: Number, required: false },
    turnover:    {type:Number,required: false},
}, { _id: false });

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
        trim: true
    },
    paymentMethod: {
        type: String,
        trim: true
    },
    paymentChannel: {
        type: String,
        trim: true
    },
    number: {
        type: String,
        required: true,
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
    offers: [offerSchema],
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
        expires: 7 * 24 * 60 * 60 // 7 days in seconds
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});


// Pre-save middleware to send email notification on transaction update
transactionSchema.post('save', async function (doc) {
    const subject = `New ${doc.transactionType} Request`;
    const text = `
        User: ${doc.userName}
        Transaction Type: ${doc.transactionType}
        Amount: ${doc.amount}
        Payment Method: ${doc.paymentMethod}
        Status: ${doc.requestStatus}
        Date: ${doc.createdAt}
    `;

    // Send email notification
    await sendEmail(subject, text);
});


// Compound index for authorId and createdAt for performance optimization
transactionSchema.index({ authorId: 1, createdAt: -1 });

const Transactions = mongoose.model('Transactions', transactionSchema);

module.exports = Transactions;
