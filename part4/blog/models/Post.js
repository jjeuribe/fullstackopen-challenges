const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

module.exports = mongoose.model('Post', postSchema)