import React, {useEffect} from 'react'
import ConnectedAnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import { useDispatch } from "react-redux"

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  },[dispatch])

  return (
    <div>
      <AnecdoteList />
      <ConnectedAnecdoteForm />
    </div>
  )
}

export default App