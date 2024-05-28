const { default: mongoose } = require("mongoose");

const paymentInstractionSchema = mongoose.Schema({
    startTitle: {
        type: String,
        required: true
    },
    listItems: {
        type: [String],
        required: true
    },
    endTitle: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})


const PaymentInstraction = mongoose.model('payInstraction', paymentInstractionSchema);

module.exports = PaymentInstraction;