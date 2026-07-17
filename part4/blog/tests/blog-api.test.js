const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blog posts are returned as json', async () => {
  await api
    .get('/api/posts')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blog posts have a unique identifier property named id', async () => {
  const response = await api.get('/api/posts')

  response.body.forEach(post => {
    assert.ok('id' in post)
  })
})

test('a new blog post is successfully added', async () => {
  const newPost = {
    title: "Julios Blog's Post",
    author: "Web Doe",
    url: "https://web.com/meet-web-doe",
    likes: 10000
  }

  const initialResponse = await api.get('/api/posts')

  await api
    .post('/api/posts')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const finalResponse = await api.get('/api/posts')

  assert.strictEqual(initialResponse.body.length + 1, finalResponse.body.length)

  const posts = finalResponse.body.map(p => p.title)

  assert(posts.includes(newPost.title))
})

test('likes property defaults to 0 when ommited ', async () => {
  const newPost = {
    title: "Juan Blog's Post",
    author: "Web Doe",
    url: "https://web.com/meet-web-doe",
  }

  const response = await api
    .post('/api/posts')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('fails with 400 Bad Request when title or url is missing', async () => {
  const newPost = {
    author: "Web Doe",
    likes: 1000
  }

  await api
    .post('/api/posts')
    .send(newPost)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})
