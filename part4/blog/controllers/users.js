const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/User')

router.post('/', async (request, response) => {
  const { name, username, password } = request.body

  if (!username?.trim()) {
    return response.status(400).json({
      error: 'username is required'
    })
  }

  if (username.length < 3) {
    return response.status(400).json({
      error: 'username must be at least 3 characters long'
    })
  }

  if (!password?.trim()) {
    return response.status(400).json({
      error: 'password is required'
    })
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({ name, username, password: passwordHash })
  const newUser = await user.save()

  return response.status(201).json(newUser)
})

router.get('/', async (request, response) => {
  const users = await User.find({})

  return response.status(200).json(users)
})

module.exports = router
