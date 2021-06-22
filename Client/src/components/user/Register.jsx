import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

import Loading from '../partials/Loading.jsx'

const Register = (props) => {
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null)
  const [phone, setPhone] = useState(null)
  const [phoneProvider, setPhoneProvider] = useState('@txt.att.net')
  const [password, setPassword] = useState(null)
  const [errors, setErrors] = useState({username: '', email: '', phone: '', password: '', confirmPassword: ''})
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    event.preventDefault()

    const { name, value } = event.target

    switch (name) {
      case 'username':
        errors.username = value.length < 5 ? 'Username must be atleast 5 chars!' : ''
        setErrors(prevState => ({...prevState, [name]: errors.username}))
        setUsername(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'phone':
        setPhone(value)
        break
      case 'phoneProvider':
        setPhoneProvider(value)
        break
      case 'password':
        errors.password = ''
        let upper, lower, hasNumber, hasSpecial = false
        let i = 0
        if (value.length < 7) { errors.password = 'Password must be atleast 8 chars!\n' }

        while (i <= value.length) {
          let char = value.charAt(i)
          if (isNaN(char) && char === char.toUpperCase()) { upper = true }
          if(isNaN(char) && char === char.toLowerCase()) { lower = true }
          if(/\d/.test(char)) { hasNumber = true }
          if(!/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]/g.test(char)) { hasSpecial = true }
          if(upper && lower && hasNumber && hasSpecial) { break }
          i++
        }
        if(!upper) { errors.password += 'Password must have at least one uppercase character!\n'}
        if(!lower) { errors.password += 'Password must have at least one lowercase character!\n'}
        if(!hasNumber) { errors.password += 'Password must have at least one number!\n'}
        if(!hasSpecial) { errors.password += 'Password must have at least one special character!\n'}
        setErrors(prevState => ({...prevState, [name]: errors.password}))
        setPassword(value)
        break
      case 'confirmPassword':
        errors.confirmPassword = (value === password) ? '' : 'Both password and confirm password must match!'
        setErrors(prevState => ({...prevState, [name]: errors.confirmPassword}))
        break
      default:
        break
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    setLoading(true)
    const headers = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        email: email,
        phone: phone,
        phone_provider: phoneProvider,
        password: password,
      })
    }

    fetch('/api/user', headers)
      .then(response => response.json())
      .then(data => console.log(data))
      .then(() => setLoading(false))
  }

  if(loading) {
    return ( <Loading /> )
  }

  return(
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Register</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{margin: '0 auto'}}>
        {loading
          ? <Loading />
          : <Form className="p-4" onSubmit={handleSubmit} style={{ width: 'fit-content', margin: '0 auto' }}>
              <Form.Row>
                <Form.Label column sm={5}>Username</Form.Label>
                <Col sm={7}>
                  <Form.Control type="text" id="username" name="username" onChange={handleChange} />
                </Col>
                {errors.username.length > 0 && <span className='error'>{errors.username}</span>}
              </Form.Row>

              <Form.Row>
                <Form.Label column sm={5}>Email</Form.Label>
                <Col sm={7}>
                  <Form.Control type="mail" id="email" name="email" onChange={handleChange} />
                </Col>
                {errors.email.length > 0 && <span className='error'>{errors.email}</span>}
              </Form.Row>

              <Form.Row>
                <Form.Label column sm={5}>Phone #</Form.Label>
                <Col sm={7}>
                  <Form.Control type="tel" id="phone" name="phone" onChange={handleChange} />
                </Col>
                {errors.phone.length > 0 && <span className='error'>{errors.phone}</span>}
              </Form.Row>

              <Form.Row>
                <Form.Label column sm={5}>Phone Provider</Form.Label>
                <Col sm={7}>
                  <Form.Control as="select" defaultValue="@txt.att.net" name="phoneProvider" id="phoneProvider" onChange={handleChange}>
                    <option value="@txt.att.net">AT&T</option>
                    <option value="@pm.sprint.com">Sprint</option>
                    <option value="@tmomail.net">T-Mobile</option>
                    <option value="@vtext.com">Verizon</option>
                    <option value="@myboostmobile.com">Boost Mobile</option>
                    <option value="@sms.mycricket.com">Cricket</option>
                    <option value="@mymetropcs.com">Metro PCS</option>
                    <option value="@mmst5.tracfone.com">Tracefone</option>
                    <option value="@email.uscc.net">U.S. Cellular</option>
                    <option value="@vmobl.com">Virgin Mobile</option>
                  </Form.Control>
                </Col>
              </Form.Row>

              <Form.Row>
                <Form.Label column sm={5}>Password</Form.Label>
                <Col sm={7}>
                  <Form.Control type="password" id="password" name="password" onChange={handleChange} />
                </Col>
                {errors.password.length > 0 && <span className='error'>{errors.password}</span>}
              </Form.Row>

              <Form.Row>
                <Form.Label column sm={5}>Confirm Password</Form.Label>
                <Col sm={7}>
                  <Form.Control type="password" id="confirmPassword" name="confirmPassword" onChange={handleChange} />
                </Col>
                {errors.confirmPassword.length > 0 && <span className='error'>{errors.confirmPassword}</span>}
              </Form.Row>

              <Form.Row className="mt-3">
                <Button sm={12} className="text-center m-auto btn-success" type="submit">Submit</Button>
              </Form.Row>
            </Form>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}
export default Register
