import React from 'react'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification} from '../reducers/notificationReducer';
import {useDispatch, useSelector} from 'react-redux'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes
    .filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase())))
  const dispatch = useDispatch()

  const vote = ({ id, content }) => {
    console.log('vote', id, content)
    dispatch(voteAnecdote(id))
    dispatch(setNotification(`you voted ${content}`))
    setTimeout(() => dispatch(clearNotification()), 5000)
  }

  return (
    <div>
    {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ).sort((a, b) => b.props.children[1].props.children[1]
        - a.props.children[1].props.children[1]
      )}
    </div>
  )
}

export default AnecdoteList