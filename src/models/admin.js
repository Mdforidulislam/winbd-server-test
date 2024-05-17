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
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type : String,
        required: true
    },
    role: {
        type: String,
        default: 'subAdmin'
    }
});

const Admin = mongoose.model('adminList',adminSchema);

module.exports = Admin;