import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Validate = () => {
  const { username, code } = useParams()

  useEffect(() => {
    const headers = {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username: username, code: code})
    }

    fetch('/api/validate', headers)
      .then(response => response.json())
      .then(data => {
        if(data.status) {
          window.location.assign('/login')
        } else {
          alert(data.error)
          window.location.assign('/login')
        }
      })
  }, [username, code])

  return (
    <div className="validate-wrapper">
    </div>
  )
}
export default Validate
