const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        trim: true
    },
    depositeChannel: {
        type: String,
        required: true,
        trim: true
    },
    transactionMethod: {
        type: String,
        required: true,
        trim: true,
        index: true // Add index here
    },
    Logo: {
        type: String,
        required: true,
        trim: true
    },
    authorId: {
        type: String,
        required: true,
        trim: true,
        index: true // Add index here
    },
    note: {
        type: {
            title: { type: String, required: true, trim: true },
            list: [{ type: String, trim: true }],
            remainder: { type: String, required: true, trim: true }
        },
        required: false
    },
    status: {
        type: String,
        default: 'deActive',
        trim: true,
        index: true // Add index here
    }
});

// Create compound index for authorId and transactionMethod
paymentMethodSchema.index({ authorId: 1, transactionMethod: 1 });

const PaymentMethodDeafult = mongoose.model('PaymentMethodDeafult', paymentMethodSchema);
const PaymentMethodActive = mongoose.model('PaymentMethodActive', paymentMethodSchema);

module.exports = { PaymentMethodDeafult, PaymentMethodActive };

