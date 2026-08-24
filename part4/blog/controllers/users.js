const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/User')

router.post('/', async (request, response) => {
  const { name, username, password } = request.body

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
