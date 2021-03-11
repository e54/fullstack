const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('initial blog amount', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('identifying property is called id', async () => {
  const response = await api.get('/api/blogs')

  for (let blog of response.body) {
    expect(blog.id).toBeDefined()
    expect(blog._id).toBeUndefined()
  }
})

test('a blog can be added with POST', async () => {
  const newBlog = {
    title: "Developer in panic",
    author: "Bill Gates",
    url: "http://microsoft.com/bill",
    likes: 0
  }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  const blogsAfterPost = await helper.blogsInDb()
  expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1)

  const addedBlog = blogsAfterPost.filter(b => b.title === newBlog.title)[0]
  expect(addedBlog).toMatchObject(newBlog)
})

test('added blog without likes gets initial like amount 0', async () => {
  const newBlog = {
    title: "Developer in panic",
    author: "Bill Gates",
    url: "http://microsoft.com/bill"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAfterPost = await helper.blogsInDb()
  const addedBlog = blogsAfterPost.filter(b => b.title === newBlog.title)[0]
  expect(addedBlog).toHaveProperty('likes', 0)
})

test('trying to add a blog without a title responds with 400 Bad request', async () => {
  const newBlog = {
    author: "Bill Gates",
    url: "http://microsoft.com/bill",
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('trying to add a blog without an URL responds with 400 Bad request', async () => {
  const newBlog = {
    title: "Developer in panic",
    author: "Bill Gates",
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const blogsInDb = await helper.blogsInDb()
  const someBlog = blogsInDb[0]

  await api
    .delete(`/api/blogs/${someBlog.id}`)
    .expect(204)

  const blogsAfterDelete = await helper.blogsInDb()
  expect(blogsAfterDelete).toHaveLength(blogsInDb.length - 1)
  expect(blogsAfterDelete).not.toContainEqual(someBlog)
})

test('the like amount of a blog can be updated', async () => {
  const blogsInDb = await helper.blogsInDb()
  const blogToUpdate = blogsInDb[0]
  blogToUpdate.likes = blogToUpdate.likes + 5

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveProperty('likes', blogToUpdate.likes)
})

afterAll(() => {
  mongoose.connection.close()
})