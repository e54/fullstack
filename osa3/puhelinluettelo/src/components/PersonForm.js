import React from 'react'

const PersonForm = (props) => {

  const tryToAddPerson = (event) => {
    event.preventDefault()

    let alreadyExists = false;
    let update = false;
    if (props.persons.some(person => person.name === props.newName)) {
      alreadyExists = true
      update = window.confirm(`${props.newName} is already added to phonebook, replace the old number with a new one?`)
    }

    if (update) {
      const person = props.persons.find(person => person.name === props.newName)
      const changedPerson = { ...person, number: props.newNumber }
      props.updatePerson(changedPerson)
    }

    if (!alreadyExists) {
      addPerson(props.newName, props.newNumber)
      props.setNewName('')
      props.setNewNumber('')
    }
  }

  const addPerson = (newName, newNumber) => {
    const person = {
      name: newName,
      number: newNumber
    }
    props.addPerson(person)
  }

  return (
    <form onSubmit={tryToAddPerson}>
    <div>name:
      <input
        value={props.newName}
        onChange={props.handleNameChange}
      />
    </div>
    <div>number:
      <input
        value={props.newNumber}
        onChange={props.handleNumberChange}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)
}

export default PersonForm