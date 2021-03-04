import React from 'react'

const Persons = ({persons, searchFilter, deletePerson}) => {

  const getFilteredPersons = () => (
    persons.filter(person =>
      person.name.toLowerCase().includes(searchFilter))
  )

  const Person = ({person, confirmDeletion}) => {
    return (
      <div>
        {person.name} {person.number}
        <button onClick={confirmDeletion}>delete</button>
      </div>
    )
  }

  const confirmDeletionOf = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      deletePerson(person)
    }
  }

  return getFilteredPersons().map(person =>
    <Person
      key={person.id}
      person={person}
      confirmDeletion={() => confirmDeletionOf(person)}
    />
  )
}

export default Persons