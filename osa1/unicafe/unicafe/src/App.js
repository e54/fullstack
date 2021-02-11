import React, { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistics = (good, neutral, bad) => {
  const totalReviews = good + neutral + bad

  if (totalReviews === 0) {
    return (
      <div>
        <h1>statistics</h1>
          No feedback given
      </div>
      )
  }

  const average = (good - bad) / totalReviews
  const positivePercentage = good / totalReviews + " %"

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={totalReviews} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positivePercentage} />
        </tbody>
      </table>
    </div>
  )
}

const StatisticLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addFeedback = (type) => {
    switch (type) {
      case 1:
        setGood(good + 1)
        break
      case 0:
        setNeutral(neutral + 1)
        break
      case -1:
        setBad(bad + 1)
        break
    }
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => addFeedback(1)} text="good" />
      <Button handleClick={() => addFeedback(0)} text="neutral" />
      <Button handleClick={() => addFeedback(-1)} text="bad" />
      {Statistics(good, neutral, bad)}
    </div>
  )
}

export default App