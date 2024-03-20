const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    content: {
        type: String, 
        required: true
    }
});


module.exports = mongoose.model('Tag', tagSchema);
