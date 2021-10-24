import React, { useState, useContext } from 'react'
import { AuthContext } from '../../App'
import { Link } from 'react-router-dom'

const Login = () => {
  const { dispatch } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const headers = {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username: username, password: password})
    }

    fetch('/api/login', headers)
      .then(response => response.json())
      .then(data => {
        if(data.status) {
          sessionStorage.setItem('User', data.user.id)
          dispatch({type: "LOGIN", payload: data})
          window.location.assign('/')
        } else {
          alert("Failed to login!")
        }
      })
  }

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <hr />
        <label for="username">Username:</label>
        <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
        <br />
        <label for="password">Password:</label>
        <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
        <br />
        <input type="submit" value="Login" />

        <hr />
      </form>

      <button><Link to="/register">Register</Link></button>
    </div>
  )
}
export default Login
