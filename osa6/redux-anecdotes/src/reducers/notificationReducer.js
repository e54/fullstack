import * as timers from "timers";

const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET NOTIFICATION':
      return action.content
    case 'CLEAR NOTIFICATION':
      return ''
    default:
      return state
  }
}

let existingTimeoutId

export const setNotification = (content, seconds) => {
  return async dispatch => {
    console.log('timeoutid',existingTimeoutId)
    if (existingTimeoutId) {
      clearTimeout(existingTimeoutId)
      existingTimeoutId = null
    }
    dispatch({
      type: 'SET NOTIFICATION',
      content: content
    })
    existingTimeoutId = await setTimeout(() => {
      dispatch({
        type: 'CLEAR NOTIFICATION'
      })
      existingTimeoutId = null
    }, seconds * 1000)
  }
}

export default notificationReducer