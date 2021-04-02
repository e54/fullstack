import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Card } from 'react-bootstrap'

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
    <Card className='blog'>
      <Card.Header>{blog.title} by {blog.author}</Card.Header>
      <Card.Body>
        <div style={expansionStyle} className='expandableContent'>
          {blog.url}<br />
          likes {blog.likes}
          <Button variant='success' id='like' onClick={addLike}>like</Button><br />
          {blog.user.name}<br />
          <div style={removeButtonStyle}>
            <Button variant='danger' onClick={deleteBlog}>remove</Button>
          </div>
        </div>
        <Button variant='primary' onClick={() => setExpanded(!expanded)}>{buttonText}</Button>
      </Card.Body>
    </Card>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog