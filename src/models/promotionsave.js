const { default: mongoose } = require("mongoose");




const promotionSaveSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
        index: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    offerAmount: {
        type: Number,
        required: false,
    },
    turnover: {
        type: Number,
        required: false,
    },
    transactionId: {
        type: String,
        required: false
    },
    userName: {
        type: String,
        required: false
    },
    amount: {
        type: String,
        required: false
    },
    authorId: {
        type: String,
        required: false
    }
})

const PromotionOffersSave = mongoose.model('promotionSave', promotionSaveSchema);

module.exports = PromotionOffersSave;