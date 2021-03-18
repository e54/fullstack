const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

let token

beforeAll(async () => {
  await User.deleteMany({})

  for (let user of helper.initialUsers) {
    await api
      .post('/api/users')
      .send(user)
  }

  const loginCredentials = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password
  }

  const response = await api
    .post('/api/login')
    .send(loginCredentials)

  token = response.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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
      .set('Authorization', `bearer ${token}`)
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
    .set('Authorization', `bearer ${token}`)
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
    .set('Authorization', `bearer ${token}`)
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
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const blog = {
    title: "My nobel prizes",
    author: "Arto Hellas",
    url: "https://artosnobels.fr/"
  }

  await api
    .post('/api/blogs/')
    .set('Authorization', `bearer ${token}`)
    .send(blog)

  const blogsInDb = await helper.blogsInDb()
  const blogInDb = blogsInDb.find(b => b.title === blog.title)

  await api
    .delete(`/api/blogs/${blogInDb.id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(204)

  const blogsAfterDelete = await helper.blogsInDb()
  expect(blogsAfterDelete).toHaveLength(blogsInDb.length - 1)
  expect(blogsAfterDelete).not.toContainEqual(blogInDb)
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

test('a blog cannot be added without an authorization token', async () => {
  const newBlog = {
    title: "Developer in panic",
    author: "Bill Gates",
    url: "http://microsoft.com/bill",
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

afterAll(() => {
  mongoose.connection.close()
})