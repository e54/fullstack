const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET USER':
      return action.user
    case 'CLEAR USER':
      return null
    default:
      return state
  }
}

export const setUser = (user) => {
  return {
      type: 'SET USER',
      user: user
    }
}

export const clearUser = () => {
  return {
      type: 'CLEAR USER'
    }
}

export default userReducer