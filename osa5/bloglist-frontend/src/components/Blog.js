import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, user, removeBlog }) => {
  const [ expanded, setExpanded ] = useState(false)

  const expansionStyle = { display: expanded ? '' : 'none' }
  const buttonText = expanded ? 'hide' : 'view'

  const addedByCurrentUser = () => (
    user !== undefined
    && user.username !== undefined
    && blog.user !== undefined
    && blog.user.username !== undefined
    && user.username === blog.user.username
  )

  const removeButtonStyle = { display: addedByCurrentUser() ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = (event) => {
    event.preventDefault()

    likeBlog({
      id: blog.id,
      user: blog.user,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      likes: blog.likes + 1
    })
  }

  const deleteBlog = (event) => {
    event.preventDefault()

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setExpanded(!expanded)}>{buttonText}</button>
      </div>
      <div style={expansionStyle} className='expandableContent'>
        {blog.url}<br />
        likes {blog.likes}
        <button id='like' onClick={addLike}>like</button><br />
        {blog.user.name}<br />
        <div style={removeButtonStyle}>
          <button onClick={deleteBlog}>remove</button>
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog