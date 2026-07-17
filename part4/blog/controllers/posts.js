const router = require('express').Router()
const Post = require('../models/Post')

router.get('/', async (request, response) => {
  const posts = await Post.find({})

  return response.json(posts)
})

router.post('/', async (request, response) => {
  const { title, author, url, likes = 0 } = request.body

  if (!title || !url) {
    return response.sendStatus(400)
  }

  const post = new Post({ title, author, url, likes })
  const savedPost = await post.save()

  return response.status(201).json(savedPost)
})

module.exports = router
