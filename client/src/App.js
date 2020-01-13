import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const App = () => {
  const [seenIndexes, setSeenIndexes] = useState([])
  const [values, setValues] = useState({})
  const [index, setIndex] = useState('')

  useEffect(() => {
    fetchAllValues()
    fetchIndexes()
  }, [])

  const fetchIndexes = async () => {
    const seenIndexes = await axios.get('/api/values/indexes')
    setSeenIndexes(seenIndexes.data)
  }

  const fetchAllValues = async () => {
    const result = await axios.get('/api/values/all')
    setValues(result.data)
  }

  const fetchValue = async index => {
    const result = await axios.get(`/api/values/${index}`)

    return result.data
  }

  const handleSubmit = async () => {
    await axios.post('/api/values', { index })

    setSeenIndexes(seenIndexes.concat({ number: index }))

    const newValue = await fetchValue(index)
    const newValues = { ...values, [index]: newValue.toString() }

    setValues(newValues)
    fetchValue(index)
    setIndex('')
  }

  const showSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(', ')
  }

  const showValues = () => {
    const entries = []

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      )
    }

    return entries
  }

  return (
    <div>
      <h1>Fibonacci calculator</h1>
      <div>Enter your index:</div>
      <div>
        <input value={index} onChange={event => setIndex(event.target.value)} />
      </div>
      <div>
        <button onClick={() => handleSubmit()}>Submit</button>
      </div>

      <h3>Indexes I have seen:</h3>
      {showSeenIndexes()}

      <h3>Calculated values</h3>
      {showValues()}
    </div>
  )
}

export default App
