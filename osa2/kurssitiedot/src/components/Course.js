import React from 'react'

const Course = ({course}) => {

  const Header = ({course}) => <h2>{course}</h2>

  const Content = ({parts}) => (
    <div>
      {parts.map(p =>
        <Part key={p.id} part={p.name} exercises={p.exercises}/>)}
    </div>
  )

  const Part = ({part, exercises}) => <p>{part} {exercises}</p>

  const Total = ({parts}) => {
    const total = parts.reduce((total, current) => total + current.exercises, 0)
    return <p><b>total of {total} exercises</b></p>
  }

  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course