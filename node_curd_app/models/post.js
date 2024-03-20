const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    tag_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true  
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true  
  
    },

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



module.exports = mongoose.model('Post', postSchema);
