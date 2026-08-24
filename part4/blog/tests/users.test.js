const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const testHelper = require('./test-helper')
const User = require('../models/User')
const app = require('../app')

const api = supertest(app)

describe('Users API', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const users = await Promise.all(
      testHelper.dummyUsers.map(async user => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    )

    await User.insertMany(users)
  })

  describe('POST /api/users', () => {
    test('creates a new user', async () => {
      const newUser = {
        name: 'Jhon Doe',
        username: 'jhondoe',
        password: 'G3n3r1cA',
      }

      const usersAtStart = await testHelper.getAllUsersFromDB()

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await testHelper.getAllUsersFromDB()
      const users = usersAtEnd.map(user => user.name)

      assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length)
      assert(users.includes(newUser.name))
    })

    test('verify user password is hashed before being stored', async () => {
      const newUser = {
        name: 'Jhon Doe',
        username: 'jhondoe',
        password: 'G3n3r1cA',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const users = await User.find({})
      const savedUser = users.find(user => user.username === newUser.username)

      assert.notStrictEqual(newUser.password, savedUser.password)

      const passwordMatches = await bcrypt.compare(newUser.password, savedUser.password)

      assert.strictEqual(passwordMatches, true)
    })
  })

  describe('GET /api/users', () => {
    test('returns all users', async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('each user has an id property', async () => {
      const response = await api.get('/api/users')

      response.body.forEach(user => {
        assert.ok('id' in user)
      })
    })

    test('does not expose user passwords', async () => {
      const response = await api.get('/api/users')

      response.body.forEach(user => {
        assert.ok(!('password' in user))
      })
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
