const { default: mongoose } = require("mongoose");


const paymentMethodSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    transactionType: {
        type: String,
        required: true
    },
    transactionMethod: {
        type: String,
        required: true
    },
    Logo: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'active'
    },
})

const PaymentMehod = mongoose.model('paymentMethod', paymentMethodSchema);

module.exports = PaymentMehod;