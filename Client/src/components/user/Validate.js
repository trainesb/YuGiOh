import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const Validate = () => {
  const { username } = useParams()
  const [code, setCode] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()

    const headers = {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username: username, code: code})
    }

    fetch('/api/validate', headers)
      .then(response => response.json())
      .then(data => {
        if(data.status) {
          alert('Account validation successful!')
          window.location.assign('/login')
        } else {
          alert(data.error)
        }
      })
  }

  return (
    <div className="validate-wrapper">
      <form className="validate-form" onSubmit={handleSubmit}>
        <h2 className="validate-title">Validate { username }</h2>
        <hr />
        <label for="code">Validation Code:</label>
        <input type="text" name="code" onChange={(e) => setCode(e.target.value)} />
        <br />

        <input type="submit" value="Validate" />
        <hr />
      </form>
    </div>
  )
}
export default Validate
