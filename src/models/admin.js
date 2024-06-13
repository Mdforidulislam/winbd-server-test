const { default: mongoose } = require("mongoose");


const adminSchema = new mongoose.Schema({
    uniqueId:{
        type: String,
        required: true,
        unique: true
    },
    subAdmin:{
        type: String,
        required: true,
        unique: true,
        index: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type : String,
        required: true,
        index: true,
    },
    role: {
        type: String,
        default: 'subAdmin'
    }
});

const Admin = mongoose.model('adminList',adminSchema);

module.exports = Admin;