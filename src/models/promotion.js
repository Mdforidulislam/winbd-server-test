const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Title should be required for identification
        unique: true, // Titles should be unique
        index: true // Add index for faster queries
    },
    description: {
        type: String,
        required: false,
    },
    amount: {
        type: Number, // Amount should be a number
        required: true,
    },
    turnover: {
        type: String,
        required: false,
    },
    percentage: {
        type: Number, // Percentage should be a number
        required: false,
    },
    fixedAmount: { // Corrected typo from 'fixtAmount' to 'fixedAmount'
        type: Number, // Fixed amount should be a number
        required: false,
    },
    allUser: {
        type: Boolean, // Should be a boolean
        required: true,
        index: true // Add index
    },
    newUser: {
        type: Boolean, // Should be a boolean
        required: true,
        index: true // Add index
    },
    allTime: {
        type: Boolean, // Should be a boolean
        required: true,
        index: true // Add index
    },
    oneTime: {
        type: Boolean, // Should be a boolean
        required: true,
        index: true // Add index
    }
});


const PromotionOffers = mongoose.model('PromotionOffer', promotionSchema);


module.exports = PromotionOffers;
