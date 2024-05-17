const { default: mongoose } = require("mongoose");

const transactionSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
        required: false
    },
    transactionType: {
        type: String,
        required:true,
    },
    amount: {
        type: Number,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: false,
    },
    paymentChannel: {
        type: String,
        required: false,
    },
    authorId: {
        type: String,
        required: true,
    },
    requestStatus: {
        type: String,
        default: 'Processing'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7 * 24 * 60 * 60 // 7 days in seconds
    }
});

const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = Transaction;