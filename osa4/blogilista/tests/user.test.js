const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})

test('initial user amount', async () => {
  const response = await api.get('/api/users')

  expect(response.body).toHaveLength(0)
})

test('cannot create user without username', async () => {
  const userWithoutUsername = {
    password: "password123",
    name: "User U. Userberg"
  }

  await api
    .post('/api/users')
    .send(userWithoutUsername)
    .expect(400, {
      error: 'User validation failed: username: Path `username` is required.'
    })

  const usersInDb = await helper.usersInDb()
  expect(usersInDb).toHaveLength(0)
})

test('cannot create a user if username is under 3 chars long', async () => {
  const userWithShortUsername = {
    username: "us",
    password: "password123",
    name: "User U. Userberg"
  }

  await api
    .post('/api/users')
    .send(userWithShortUsername)
    .expect(400, {
      error: 'User validation failed: username: Path `username` (`us`) is shorter than the minimum allowed length (3).'
    })

  const usersInDb = await helper.usersInDb()
  expect(usersInDb).toHaveLength(0)
})

test('cannot create a user if username is not unique', async () => {
  let user = {
    username: "username",
    password: "password123",
    name: "User U. Userberg"
  }

  await api
    .post('/api/users')
    .send(user)

  let usersInDb = await helper.usersInDb()
  expect(usersInDb).toHaveLength(1)

  user = {
    username: "username",
    password: "dogVsCat",
    name: "Hella Artos"
  }

  await api
    .post('/api/users')
    .send(user)
    .expect(400, {
      error: 'User validation failed: username: Error, expected `username` to be unique. Value: `username`'
    })

  usersInDb = await helper.usersInDb()
  expect(usersInDb).toHaveLength(1)
})

test('cannot create user without password', async () => {
  const userWithoutPassword = {
    username: "user",
    name: "User U. Userberg"
  }

  await api
    .post('/api/users')
    .send(userWithoutPassword)
    .expect(400, {
      error: 'password missing'
    })

  const usersInDb = await helper.usersInDb()
  expect(usersInDb).toHaveLength(0)
})

test('cannot create a user if password is under 3 chars long', async () => {
  const userWithShortPassword = {
    username: "user",
    password: "pw",
    name: "User U. Userberg"
  }

  await api
    .post('/api/users')
    .send(userWithShortPassword)
    .expect(400, {
      error: 'password too short, minimum length (3)'
    })

  const usersInDb = await helper.usersInDb()
  expect(usersInDb).toHaveLength(0)
})

afterAll(() => {
  mongoose.connection.close()
})