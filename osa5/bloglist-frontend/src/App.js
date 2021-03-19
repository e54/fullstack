import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import CreateBlogForm from './components/CreateBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [ notification, setNotification ] = useState(null)
  const [ isError, setIsError ] = useState(false)

  const createBlogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )}, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
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
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification('wrong username or password', true)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    window.location.reload()
  }

  const addBlog = async (blogObject) => {
    createBlogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, false)
  }

  const createBlogForm = () => (
    <Togglable buttonLabel='new blog' ref={createBlogFormRef}>
      <CreateBlogForm createBlog={addBlog} />
    </Togglable>
  )

  const likeBlog = async (updatedBlogObject) => {
    const returnedBlog = await blogService.like(updatedBlogObject)

    setBlogs(blogs.map(b => {
      if (b.id === returnedBlog.id) {
        returnedBlog.user = b.user
        return returnedBlog
      } else {
        return b
      }
    }))
  }

  const removeBlog = async (id) => {
    await blogService.remove(id)

    setBlogs(blogs.filter(b => b.id !== id))
  }

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }

    return (
      <div
        className={isError ? 'error' : 'notification'}
        style={notificationStyle}
      >
        {message}
      </div>
    )
  }

  const notificationStyle = {
    color: isError ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const showNotification = (text, showAsError) => {
    setIsError(showAsError)
    setNotification(text)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} />
        <form onSubmit={handleLogin}>
          <div>
          username
            <input
              id='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
          password
            <input
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button id='login' type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      <p>{user.name} logged in
        <button id='newblog' onClick={logout}>
          logout
        </button>
      </p>
      {createBlogForm()}
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          user={user}
          removeBlog = {removeBlog}
        />
      ).sort((a, b) => b.props.blog.likes - a.props.blog.likes)}
    </div>
  )
}

export default App