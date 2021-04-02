import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_BLOG':
      return state.concat(action.data)
    case 'INIT_BLOGS':
      return action.data
    case 'LIKE':
      return state.map(blog =>
        blog.id !== action.data.id ? blog : action.data
      )
    default:
      return state
  }
}

export const addBlog = (content) => {
  return async dispatch => {
    console.log('addBlog got content:',content)
    const newBlog = await blogService.create(content)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const likeBlog = (updatedBlog) => {
  return async dispatch => {
    const blogAfterLike =
      await blogService.like(updatedBlog)
    dispatch({
      type: 'LIKE',
      data: blogAfterLike
    })
  }
}

export default blogReducer