import React, { useState, useContext } from 'react'
import { AuthContext } from "../../App"

import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export const Login = () => {
  const { dispatch } = useContext(AuthContext)
  const [data, setData] = useState({
    username: "",
    password: "",
    isSubmitting: "",
    errorMessage: "",
  })
  const [userId, setUserId] = useState(null)

  const handleInputChange = (event) => {
    setData({...data, [event.target.name]: event.target.value})
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()

    setData({...data, isSubmitting: true, errorMessage: null})
    const headers = {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username: data.username, password: data.password})
    }
    fetch("/api/user/login", headers)
      .then(response => response.json())
      .then(dt => {
        console.log(dt)
        if(dt.status) {
          console.log(dt.user)
          sessionStorage.setItem('User', dt.user.id)
          dispatch({type: "LOGIN", payload: dt})
          window.location.assign('/')
        } else {
          setData({...data, isSubmitting: false, errorMessage: dt.error})
          alert('Login Failed: ' + dt.error)
        }
      })
  }

  const handleRegister = (event) => {
    dispatch({type: "SET_PAGE", payload: 'register'})
  }

  return(
    <Card>
      <Card.Header className="text-center">
        <h2>Login</h2>
      </Card.Header>
      <Card.Body>
        <form onSubmit={handleFormSubmit} className="login-wrapper form-wrapper">
          <Container fluid>
            <Row className="m-2">
              <Col sm={4}>
                <label htmlFor="username">Username:</label>
              </Col>
              <Col sm={8}>
                <input type="text" name="username" value={data.email} onChange={handleInputChange} />
              </Col>
            </Row>
            <Row className="m-2">
              <Col sm={4}>
                <label htmlFor="password">Password:</label>
              </Col>
              <Col sm={8}>
                <input type="password" id="password" name="password" value={data.password} onChange={handleInputChange} />
              </Col>
            </Row>
            <Row>
              <Col sm={12} className="text-center">
                {data.errorMessage && <span className="form-error">{data.errorMessage}</span>}
              </Col>
            </Row>
            <Row className="m-2">
              <Col sm={12} className="text-center">
                <button disabled={data.isSubmitting}>{data.isSubmitting ? "Loading..." : "Login"}</button>
              </Col>
            </Row>

            <Row>
              <Col sm={12} className="text-center">
                <p style={{cursor: 'pointer'}} onClick={handleRegister}>Register</p>
              </Col>
            </Row>
          </Container>
        </form>
      </Card.Body>

    </Card>
  )
}
export default Login
