const router = require('express').Router()
const User = require('../models/User')
const Post = require('../models/Post')

router.get('/', async (request, response) => {
  const posts = await Post.find({}).populate('user', {
    id: 1,
    name: 1,
    username: 1
  })

  return response.json(posts)
})

router.post('/', async (request, response) => {
  const { title, author, url, likes = 0 } = request.body

  if (!title?.trim()) {
    return response.status(400).json({
      error: 'post title is required'
    })
  }

  if (!url?.trim()) {
    return response.status(400).json({
      error: 'post url is required'
    })
  }

  const user = await User.findOne()
  const post = new Post({ title, author, url, likes, user: user._id })
  const newPost = await post.save()

  user.posts = user.posts.concat(newPost._id)
  await user.save()

  return response.status(201).json(newPost)
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
