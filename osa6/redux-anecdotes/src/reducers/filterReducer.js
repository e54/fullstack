const filterReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET FILTER':
      return action.text
    default:
      return state
  }
}

export const setFilter = (content) => {
  return {
    type: 'SET FILTER',
    text: content
  }
}

export default filterReducer