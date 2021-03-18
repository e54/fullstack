import React, { useState } from 'react'

const Blog = ({blog}) => {
  const [ expanded, setExpanded ] = useState(false)

  const expansionStyle = { display: expanded ? '' : 'none' }
  const buttonText = expanded ? 'hide' : 'view'

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setExpanded(!expanded)}>{buttonText}</button>
      </div>
      <div style={expansionStyle}>
        {blog.url}<br />
        likes {blog.likes}<button>like</button><br />
        {blog.user.name}
      </div>
    </div>
  )
}

export default Blog