const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String, 
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
    }
});

const UserList = mongoose.model('userList', UsersSchema);

module.exports = { UserList };
