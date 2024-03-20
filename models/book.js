const mongoose = require("mongoose");



const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },


  total_pages: {
    type: String, // Assuming total_pages should be a number
    required: true,
  },
  
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author", // Reference the Author model
    required: true,
  },

  publish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publish", // Reference the Author model
    required: true,
  },

  price: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Book", bookSchema);
