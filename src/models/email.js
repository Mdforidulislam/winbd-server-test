const { default: mongoose } = require("mongoose");

const emailShema = new mongoose.Schema({
    authoreId: {
        type: String,
        required: true,
        index: true,
        trim:true,
    },
    email: {
        type: String,
        required: true,
        index: true,
        trim: true,
    }
});

const EmailBox = mongoose.model('emailbox', emailShema);

module.exports = { EmailBox };