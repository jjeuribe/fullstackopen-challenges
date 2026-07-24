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

router.delete('/:id', async (request, response) => {
  const { id } = request.params

  const deletedPost = await Post.findByIdAndDelete(id)

  if (!deletedPost) {
    return response.status(404).json({
      error: 'post not found'
    })
  }

  return response.status(204).end()
})

router.patch('/:id', async (request, response) => {
  const { id } = request.params
  const { likes } = request.body

  if (!likes) {
    return response.status(400).json({
      error: 'likes is required'
    })
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { likes },
    { new: true }
  )

  if (!updatedPost) {
    return response.status(404).json({
      error: 'post not found'
    })
  }

  return response.status(204).end()
})

module.exports = router
