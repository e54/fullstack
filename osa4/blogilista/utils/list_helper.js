const _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  return _.pick(blogs.find(blog => blog.likes === maxLikes),
    ['title', 'author', 'likes'])
}

const mostBlogs = (blogs) => {
  const authorToBlogAmount = _.toPairs(_.countBy(blogs, 'author'))
  const maxBlogs = Math.max(...authorToBlogAmount.map(arr => arr[1]))
  return {
    author: authorToBlogAmount.find(arr => arr[1] === maxBlogs)[0],
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  const authorToLikes = _.reduce(blogs, (result, value) => {
    if (result[value.author]) {
      result[value.author] += value.likes
    } else {
      result[value.author] = value.likes
    }
    return result
  }, {})

  const authorToLikeAmount = _.toPairs(authorToLikes)
  const maxLikes = Math.max(...authorToLikeAmount.map(arr => arr[1]))
  return {
    author: authorToLikeAmount.find(arr => arr[1] === maxLikes)[0],
    likes: maxLikes
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}