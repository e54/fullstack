import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import CreateBlogForm from './components/CreateBlogForm'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, addBlog, likeBlog, removeBlog } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducer'
import { Form, Button, Alert } from 'react-bootstrap'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ isError, setIsError ] = useState(false)

  const dispatch = useDispatch()

  const createBlogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  },[dispatch])

  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification('wrong username or password', true)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(clearUser())
    window.location.reload()
  }

  const addNewBlog = async (blogObject) => {
    console.log('sain blogObject:',blogObject)
    createBlogFormRef.current.toggleVisibility()
    await dispatch(addBlog(blogObject))
    showNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`, false)
  }

  const createBlogForm = () => (
    <Togglable buttonLabel='new blog' ref={createBlogFormRef}>
      <CreateBlogForm createBlog={addNewBlog} />
    </Togglable>
  )

  const addLikeToBlog = async (updatedBlogObject) => {
    await dispatch(likeBlog(updatedBlogObject))
  }

  const removeExistingBlog = async (id) => {
    await dispatch(removeBlog(id))
  }

  const Notification = () => {
    const notification = useSelector(state => state.notification)
    if (!notification) {
      return null
    }

    const alertClassType = isError ? 'danger' : 'success'
    const alertClass = `alert alert-${alertClassType}`

    return (
      <Alert class={alertClass}>{notification}</Alert>
    )
  }

  const showNotification = (text, showAsError) => {
    setIsError(showAsError)
    dispatch(setNotification(text, 5))
  }

  if (user === null) {
    return (
      <div className="container">
        <h2>Log in to application</h2>
        <Notification />
        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>username</Form.Label>
            <Form.Control
              id='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              />
            <Form.Label>password</Form.Label>
            <Form.Control
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
          />
          <Button variant='primary' id='login' type="submit">login</Button>
          </Form.Group>
        </Form>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>blogs</h2>
      <Notification />
      <p>{user.name} logged in
        <Button variant='warning' onClick={logout}>
          logout
        </Button>
      </p>
      {createBlogForm()}
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={addLikeToBlog}
          user={user}
          removeBlog = {removeExistingBlog}
        />
      ).sort((a, b) => b.props.blog.likes - a.props.blog.likes)}
    </div>
  )
}

export default App