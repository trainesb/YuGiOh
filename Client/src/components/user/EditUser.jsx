import React, { useState, useContext } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Loading from '../partials/Loading.jsx'
import { AuthContext } from "../../App"

const EditUser = (props) => {
  const { state, dispatch } = useContext(AuthContext)
  const [id] = useState(props.id)
  const [username, setUsername] = useState(props.username)
  const [email, setEmail] = useState(props.email)
  const [phone, setPhone] = useState(props.phone)
  const [phoneProvider, setPhoneProvider] = useState(props.phoneProvider)
  const [loading, setLoading] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)

    const headers = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
        username: username,
        email: email,
        phone: phone,
        phone_provider: phoneProvider
      })
    }

    fetch('/api/user/' + id, headers)
      .then(response => response.json())
      .then(data => {
        setLoading(false)
        if (data.status) {
          props.handleEdit()
          alert('User has been updated successfully!')
        } else {
          alert('Failed to update user!')
        }
      })

  }


  return(
    <Card className="text-center" style={{ height: 'max-content', width: '20em', backgroundColor: '#c1e3ff' }}>
      <Card.Header className="d-flex justify-content-between">
        <Button variant='secondary' onClick={props.handleEdit}>Cancel</Button>
        {state.user.role === "A" && <Button variant='danger' onClick={props.handleDelete}>Delete</Button>}
      </Card.Header>
      <Card.Body>
        {loading
          ? <Loading />
          : <Form onSubmit={handleSubmit}>

              <Form.Group as={Row} controlId="username">
                <Form.Label column sm={5}>Username: </Form.Label>
                <Col sm={7}>
                  <Form.Control name="username" defaultValue={username} onChange={(e) => setUsername(e.target.value)} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="email">
                <Form.Label column sm={3}>Email: </Form.Label>
                <Col sm={9}>
                  <Form.Control name="email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="phone">
                <Form.Label column sm={4}>Phone: </Form.Label>
                <Col sm={8}>
                  <Form.Control name="phone" defaultValue={phone} onChange={(e) => setPhone(e.target.value)} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="phone_provider">
                <Form.Label column sm={6}>Phone Provider: </Form.Label>
                <Col sm={6}>
                  <Form.Control as="select" name="phone_provider" defaultValue={phoneProvider} onChange={(e) => setPhoneProvider(e.target.value)}>
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
              </Form.Group>

              <Form.Group as={Row}>
                <Col sm={12} className="text-center m-3">
                  <Button className="btn-dark" onClick={props.handlePassword}>Change Password</Button>
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Col sm={12} className="text-center m-3">
                  <Button type="submit" className="btn-success">Submit</Button>
                </Col>
              </Form.Group>
            </Form>
        }
      </Card.Body>
    </Card>
  )
}
export default EditUser
