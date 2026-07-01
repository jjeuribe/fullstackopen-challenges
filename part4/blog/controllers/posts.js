const router = require('express').Router()
const Post = require('../models/Post')

router.get('/', (request, response) => {
  Post.find({}).then((posts) => {
    response.json(posts)
  })
})

router.post('/', (request, response) => {
  const post = new Post(request.body)

  post.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = router