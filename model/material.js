const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
let material = new Schema({ 
  filename: String,
  hashname: String,
  size: Number,
  path: String,
  url: String,
  author: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  }
});

module.exports = mongoose.model('Material', material);