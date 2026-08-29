const bcrypt = require('bcrypt')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/User')

router.post('/', async (request, response) => {
  const { username, password } = request.body

  if (!username?.trim()) {
    return response.status(400).json({
      error: 'username is required'
    })
  }

  if (!password?.trim()) {
    return response.status(400).json({
      error: 'password is required'
    })
  }

  const user = await User.findOne({ username })

  if (!user) {
    return response.status(401).json({
      error: 'invalid credentials'
    })
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return response.status(401).json({
      error: 'invalid credentials'
    })
  }

  const payload = {
    id: user._id,
    username: user.username,
    name: user.name
  }

  const token = jwt.sign(
    payload,
    config.JWT_SECRET,
    { expiresIn: '15m' }
  )

  return response.status(200).json({
    name: user.name,
    username: user.username,
    token
  })
})

module.exports = router
