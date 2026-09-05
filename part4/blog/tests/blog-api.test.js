const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const testHelper = require('./test-helper')
const app = require('../app')

const api = supertest(app)

describe('Blog posts API', () => {
  beforeEach(async () => {
    await testHelper.clearDatabase()

    const [user] = await testHelper.createUsers(testHelper.dummyUsers)

    await testHelper.setupPostsForUser(
      user,
      testHelper.dummyPosts
    )
  })

  describe('when retrieving blog posts', () => {
    test('return blog posts as JSON', async () => {
      await api
        .get('/api/posts')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('each blog post has a unique property named id', async () => {
      const response = await api.get('/api/posts')

      response.body.forEach(post => {
        assert.ok('id' in post)
      })
    })

    test('each blog post as a creator', async () => {
      const response = await api.get('/api/posts')

      response.body.forEach(post => {
        assert.ok(post.user)
        assert.ok(post.user.id)
        assert.ok(post.user.username)
        assert.ok(post.user.name)
      })
    })
  })

  describe('when creating a blog post', () => {
    test('creates a new blog post', async () => {
      const { username } = testHelper.dummyUsers[0]
      const creator = await testHelper.getUserByUsername(username)
      const token = await testHelper.generateAuthTokenFor(creator)

      const newPost = {
        title: 'Julios Blog\'s Post',
        author: 'Web Doe',
        url: 'https://web.com/meet-web-doe',
        likes: 10000
      }

      const postsAtStart = await testHelper.getAllPostsFromDB()

      const response = await api
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const postsAtEnd = await testHelper.getAllPostsFromDB()

      assert.strictEqual(postsAtStart.length + 1, postsAtEnd.length)

      // Verify created Post
      const createdPost = postsAtEnd.find(
        post => post.id === response.body.id
      )

      assert.ok(createdPost)
      assert.strictEqual(createdPost.title, newPost.title)
      assert.strictEqual(createdPost.author, newPost.author)
      assert.strictEqual(createdPost.url, newPost.url)
      assert.strictEqual(createdPost.likes, newPost.likes)
      assert.ok(createdPost.user)

      // Verify User who created the Post and their Posts
      const refreshedCreator = await testHelper.getUserByUsername(username)

      assert.strictEqual(refreshedCreator.id.toString(), createdPost.user.toString())
      assert.ok(refreshedCreator.posts.some(
        post => post.toString() === createdPost.id.toString()
      ))
    })

    test('defaults likes to 0 when the like property is ommited ', async () => {
      const { username } = testHelper.dummyUsers[0]
      const creator = await testHelper.getUserByUsername(username)
      const token = await testHelper.generateAuthTokenFor(creator)

      const newPost = {
        title: 'Juan Blog\'s Post',
        author: 'Web Doe',
        url: 'https://web.com/meet-web-doe',
      }

      const response = await api
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('returns 400 Bad Request when title or url is missing', async () => {
      const newPost = {
        author: 'Web Doe',
        likes: 1000
      }

      await api
        .post('/api/posts')
        .send(newPost)
        .expect(400)
    })
  })

  describe('when deleting a blog post', () => {
    test('removes an existing blog post', async () => {
      const postsAtStart = await testHelper.getAllPostsFromDB()
      const postToDelete = postsAtStart[0]

      await api
        .delete(`/api/posts/${postToDelete.id}`)
        .expect(204)

      const postsAtEnd = await testHelper.getAllPostsFromDB()
      const postIds = postsAtEnd.map(p => p.id)

      assert.strictEqual(postsAtStart.length - 1, postsAtEnd.length)
      assert(!postIds.includes(postToDelete.id))
    })

    test('returns 404 Not Found when the blog post does not exist', async () => {
      const nonExistingPost = await testHelper.createNonExistingPost()

      await api
        .delete(`/api/posts/${nonExistingPost.id}`)
        .expect(404)
    })
  })

  describe('when updating a blog post', () => {
    test('updates the post likes count', async () => {
      const postsAtStart = await testHelper.getAllPostsFromDB()
      const postToUpdate = postsAtStart[0]
      const newLikes = postToUpdate.likes + 1

      await api
        .patch(`/api/posts/${postToUpdate.id}`)
        .send({ likes: newLikes })
        .expect(204)

      const postsAtEnd = await testHelper.getAllPostsFromDB()
      const updatedPost = postsAtEnd.find(p => p.id === postToUpdate.id)

      assert.strictEqual(updatedPost.likes, newLikes)
    })

    test('returns 404 Not Found when updating a blog post that does not exist', async () => {
      const nonExistingPost = await testHelper.createNonExistingPost()

      const response = await api
        .patch(`/api/posts/${nonExistingPost.id}`)
        .send({ likes: nonExistingPost.likes + 1 })
        .expect(404)

      assert.strictEqual(response.body.error, 'post not found')
    })

    test('returns400 Bad Request when the likes property is missing', async () => {
      const nonExistingPost = await testHelper.createNonExistingPost()

      const response = await api
        .patch(`/api/posts/${nonExistingPost.id}`)
        .send({})
        .expect(400)

      assert.strictEqual(response.body.error, 'likes is required')
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
