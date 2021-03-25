const initialState = ''

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET':
      return action.content
    default:
      return state
  }
}

export const setFilter = (content) => {
  return {
    type: 'SET',
    content: content
  }
}

export default filterReducer