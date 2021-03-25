const initialState = ''

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET':
      return action.content
    case 'CLEAR':
      return ''
    default:
      return state
  }
}

export const setNotification = (content) => {
  return {
    type: 'SET',
    content: content
  }
}

export const clearNotification = () => {
  return {
    type: 'CLEAR'
  }
}

export default notificationReducer