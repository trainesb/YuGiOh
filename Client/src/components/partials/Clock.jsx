import React, { useState, useEffect } from 'react'

const Clock = () => {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    let timerID = setInterval(() => tick(), 1000)
    return function cleanup() { clearInterval(timerID) }
  }, [])

  function tick() { setDate(new Date()) }

  return (
    <div className="clock">
      <h1><i>Yu-Gi-Oh!</i> Archive</h1>
      <h2>{date.getMonth()+1}/{date.getDate()}/{date.getFullYear()} - {date.toLocaleTimeString()}</h2>
    </div>
  )
}
export default Clock
