const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        index: true // Add index to userName for faster lookup
    },
    password: {
        type: String,
        required: true,
        index: true,
    },
    phoneNumber: {
        type: String, 
        required: true,
        unique: true,
    },
    authorId: {
        type: String,
        required: true,
        index: true // Add index to authorId for faster lookup
    },
    role: {
        type: String,
        default: 'user',
    }
});

const UserList = mongoose.model('userList', UsersSchema);

module.exports = { UserList };
