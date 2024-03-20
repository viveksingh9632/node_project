const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    content: {
        type: String, // Define content field as String type
        required: true
    }
});


module.exports = mongoose.model('Category', categorySchema);
