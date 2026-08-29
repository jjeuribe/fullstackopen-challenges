const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const testHelper = require('./test-helper')
const User = require('../models/User')
const app = require('../app')

const api = supertest(app)

describe('Login API', () => {
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

  describe('POST /api/login', () => {
    test('succeeds with valid credentials', async () => {
      const { username, name, password } = testHelper.dummyUsers[0]
      const credentials = { username, password }

      const response = await api
        .post('/api/login')
        .send(credentials)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.username, username)
      assert.ok(response.body.name, name)
      assert.ok(response.body.token)
    })

    test('fails with invalid password', async () => {
      const { username } = testHelper.dummyUsers[0]
      const invalidCredentials = { username, password: 'wr0ngPa55w0rd' }

      const response = await api
        .post('/api/login')
        .send(invalidCredentials)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.error, 'invalid credentials')
    })

    test('fails when user does not exist', async () => {
      const invalidCredentials = { username: 'nonexistent-user', password: 'wr0ngPa55w0rd' }

      const response = await api
        .post('/api/login')
        .send(invalidCredentials)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.error, 'invalid credentials')
    })

    test('fails when no username is provided', async () => {
      const { password } = testHelper.dummyUsers[0]
      const credentials = { password }

      const response = await api
        .post('/api/login')
        .send(credentials)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.error, 'username is required')
    })

    test('fails when password is not provided', async () => {
      const { username } = testHelper.dummyUsers[0]
      const credentials = { username }

      const response = await api
        .post('/api/login')
        .send(credentials)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.error, 'password is required')
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
