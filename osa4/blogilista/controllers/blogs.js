const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  if (body.title === undefined || body.url === undefined) {
    response.status(400)
  }

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
    .then(b => b.populate('user', { username: 1, name: 1, id: 1 })
      .execPopulate())
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog === null) {
    return response.status(403).json({ error: 'blog with given id not found' })
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'cannot remove blog inserted by other user' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }

  const updatedBlog = await
    Blog
      .findByIdAndUpdate(request.params.id, blog, { new: true })
      .populate('user', { username: 1, name: 1, id: 1 })
  response.json(updatedBlog)
})

module.exports = blogsRouter