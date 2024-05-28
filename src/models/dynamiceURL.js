const mongoose = require('mongoose');

// Define the schema using mongoose.Schema
const dynamicURLSchema = new mongoose.Schema({
    redirectUrl: {
        type: String,
        required: true
    }
});

// Create the model with the schema
const DynamicallyUrl = mongoose.model('DynamicallyUrl', dynamicURLSchema);

module.exports = DynamicallyUrl;
