const dummy = (posts) => {
    return 1;
}

const totalLikes = (posts) => {
  return posts.reduce((acc, post) => acc + post.likes, 0)
}

const favoritePost = (posts) => {
  if (posts.length === 0) {
    return null
  }

  return posts.reduce((previousPost, post) =>
    post.likes > previousPost.likes ? post : previousPost
  )
}

const mostPosts = (posts) => {
  if (posts.length === 0) {
    return null
  }

  const postsByAuthor = {}; 

  for (let post of posts) {
    postsByAuthor[post.author] = (postsByAuthor[post.author] || 0) + 1
  }

  const [author, postsCount ] = Object
    .entries(postsByAuthor)
    .reduce((previousAuthor, author) =>
      author[1] > previousAuthor[1] ? author : previousAuthor
    )
  
  return {
    author,
    posts: postsCount
  };
}

const mostLikes = (posts) => {
  if (posts.length === 0) {
    return null
  }

  const totalLikesByAuthor = {}

  for (let post of posts) {
    totalLikesByAuthor[post.author] = (totalLikesByAuthor[post.author] || 0) + post.likes
  }

  const [author, likesCount ] = Object
    .entries(totalLikesByAuthor)
    .reduce((previousAuthor, author) =>
      author[1] > previousAuthor[1] ? author : previousAuthor
  )
  
  return {
    author,
    likes: likesCount
  };
}

module.exports = {
    dummy,
    totalLikes, 
    favoritePost,
    mostPosts,
    mostLikes
}