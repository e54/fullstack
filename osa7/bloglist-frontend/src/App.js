import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import CreateBlogForm from './components/CreateBlogForm'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, addBlog, likeBlog } from './reducers/blogReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [ isError, setIsError ] = useState(false)

  const dispatch = useDispatch()

  const createBlogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  },[dispatch])

  const blogs = useSelector(state => state.blogs)

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

  const removeBlog = async (id) => {
    await blogService.remove(id)
  }

  const Notification = () => {
    const notification = useSelector(state => state.notification)
    if (!notification) {
      return null
    }

    return (
      <div
        className={isError ? 'error' : 'notification'}
        style={notificationStyle}
      >
        {notification}
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
    dispatch(setNotification(text, 5))
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
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
      <Notification />
      <p>{user.name} logged in
        <button onClick={logout}>
          logout
        </button>
      </p>
      {createBlogForm()}
      {console.log('blogs:',blogs)}
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={addLikeToBlog}
          user={user}
          removeBlog = {removeBlog}
        />
      ).sort((a, b) => b.props.blog.likes - a.props.blog.likes)}
    </div>
  )
}

export default App