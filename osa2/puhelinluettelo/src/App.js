import React, { useState, useEffect } from 'react'
import personService from './services/personService'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ searchFilter, setSearchFilter ] = useState('')
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ notification, setNotification ] = useState(null)
  const [ isError, setIsError ] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(returnedPersons => {
        setPersons(returnedPersons)
      })
  }, [])

  const handleSearchFilterChange = (event) => {
    setSearchFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = person => {
    personService
      .create(person)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        showNotification(`Added ${returnedPerson.name}`)
      })
  }

  const updatePerson = person => {
    personService
      .update(person.id, person)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
        showNotification(`Updated number ${returnedPerson.number} to ${returnedPerson.name}`)
      })
  }

  const deletePerson = person => {
    personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
        showNotification(`Deleted ${person.name}`)
      })
      .catch(() => {
        showNotification(
          `Information of ${person.name} has already been removed from the server`,
          true)
      })
  }

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }

    return (
      <div style={notificationStyle}>
        {message}
      </div>
    )
  }

  const notificationStyle = {
    color: isError ? 'red' : 'green',
    background: 'lightgrey',
    fontStyle: 'italic',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const showNotification = (text, showAsError) => {
    setIsError(showAsError)
    setNotification(text)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter
        searchFilter={searchFilter}
        handleSearchFilterChange={handleSearchFilterChange}
      />
      <h3>add a new</h3>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
        updatePerson={updatePerson}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        searchFilter={searchFilter}
        deletePerson={deletePerson}
      />
    </div>
  )

}

export default App