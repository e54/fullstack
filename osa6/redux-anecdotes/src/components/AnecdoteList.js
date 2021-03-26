import React from 'react'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification} from '../reducers/notificationReducer';
import {useDispatch, useSelector} from 'react-redux'
import ConnectedNotification from "./Notification";
import ConnectedFilter from "./Filter";

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    if (state.filter) {
      return state.anecdotes.filter(a => a.content.toLowerCase()
          .includes(state.filter.toLowerCase()))
    }
    return state.anecdotes
  })

  const dispatch = useDispatch()

  const vote = (anecdote) => {
    console.log('vote for', anecdote)
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <ConnectedNotification />
      <ConnectedFilter />
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