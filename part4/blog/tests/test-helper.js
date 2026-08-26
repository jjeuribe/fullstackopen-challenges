const bcrypt = require('bcrypt')
const Post = require('../models/Post')
const User = require('../models/User')

const dummyPosts = [
  {
    title: 'Juan Blog\'s Post',
    author: 'Web Doe',
    url: 'https://web.com/meet-web-doe',
    likes: 0,
  },
  {
    title: 'Learning JavaScript',
    author: 'Jane Developer',
    url: 'https://web.com/learning-javascript',
    likes: 12,
  },
  {
    title: 'Building My First Full-Stack App',
    author: 'Code Master',
    url: 'https://web.com/first-full-stack-app',
    likes: 8,
  },
  {
    title: 'Understanding REST APIs',
    author: 'API Explorer',
    url: 'https://web.com/understanding-rest-apis',
    likes: 25,
  },
];

const dummyUsers = [
  {
    name: 'Jane Smith',
    username: 'janesmith',
    password: 'secret456'
  },
  {
    name: 'Carlos García',
    username: 'cgarcia',
    password: 'myPassword789'
  },
  {
    name: 'Emily Johnson',
    username: 'emilyj',
    password: 'helloWorld321'
  }
]

const getAllPostsFromDB = async () => {
  const posts = await Post.find({})
  return posts.map(post => post.toJSON())
}

const getAllUsersFromDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createNonExistingPost = async () => {
  const post = new Post({
    title: 'willremovethissoon',
    author: 'willremovethissoon',
    url: 'willremovethissoon',
    likes: 0,
  })

  await post.save()
  await post.deleteOne()

  return post.toJSON()
}

const setupUserWithPosts = async () => {
  const dummyUser = dummyUsers[0]

  const user = await User.create({
    ...dummyUser,
    password: await bcrypt.hash(dummyUser.password, 10)
  })

  const posts = await Post.insertMany(
    dummyPosts.map(post => ({
      ...post,
      user: user._id
    }))
  )

  user.posts = posts.map(post => post._id)
  await user.save()

  return { user, posts }
}

module.exports = {
  dummyPosts,
  dummyUsers,
  getAllPostsFromDB,
  createNonExistingPost,
  getAllUsersFromDB,
  setupUserWithPosts
}
