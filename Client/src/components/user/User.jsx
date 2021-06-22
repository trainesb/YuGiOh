import React, { useState, useContext } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { AuthContext } from "../../App"
import EditUser from './EditUser.jsx'

const providers = {
        '@txt.att.net': 'AT&T',
        '@pm.sprint.com': 'Sprint',
        '@tmomail.net': 'T-Mobile',
        '@vtext.com': 'Verizon',
        '@myboostmobile.com': 'Boost Mobile',
        '@sms.mycricket.com': 'Cricket',
        '@mymetropcs.com': 'Metro PCS',
        '@mmst5.tracfone.com': 'Tracefone',
        '@email.uscc.net': 'U.S. Cellular',
        '@vmobl.com': 'Virgin Mobile'
    }

const User = (props) => {
  const { state, dispatch } = useContext(AuthContext)
  const [edit, setEdit] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const [id] = useState(props.id)
  const [username] = useState(props.username)
  const [email] = useState(props.email)
  const [phone] = useState(props.phone)
  const [phoneProvider] = useState(props.phoneProvider)

  const [oldPassword, setOldPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)
  const [confirmNewPassword, setConfirmNewPassword] = useState(null)

  function handleDelete(event) {
    event.preventDefault()

    fetch('/api/user/' + id, {method: 'DELETE'})
      .then(response => response.json())
      .then(() => window.location.reload())
  }

  function handleEdit() { setEdit(!edit) }

  function handleChangePassword(event) {
    event.preventDefault()

    if (newPassword !== confirmNewPassword) {
      alert('Error: New password and confirmation password do not match!')
    } else {
      const headers = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword
        })
      }

      fetch('/api/user/password/' + id, headers)
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            setEdit(false)
            setChangePassword(false)
            alert('User password has updated successfully!')
            window.location.reload()
          } else {
            alert(data.error)
          }
        })
    }
  }

  function handlePassword(event) {
    event.preventDefault()
    setEdit(false)
    setChangePassword(true)
  }

  if(edit) {
    return(<EditUser
      id={id}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handlePassword={handlePassword}
      username={username}
      email={email}
      phone={phone}
      phoneProvider={phoneProvider}
      />)
  } else if (changePassword) {
    return(
      <Card className="text-center" style={{ height: 'max-content', width: '20em', backgroundColor: '#c1e3ff' }}>
        <Card.Header className="d-flex justify-content-between">
          <Button variant='secondary' onClick={() => setChangePassword(false)}>Cancel</Button>

          <Button variant='danger' onClick={handleDelete}>Delete</Button>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleChangePassword}>
            <Form.Group as={Row} controlId="old_password">
              <Form.Label column sm={6}>Old Password: </Form.Label>
              <Col sm={6}>
                <Form.Control name="old_password" type="password" defaultValue='' onChange={(e) => setOldPassword(e.target.value)} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="new_password">
              <Form.Label column sm={5}>New Password: </Form.Label>
              <Col sm={7}>
                <Form.Control name="new_password" type="password" defaultValue='' onChange={(e) => setNewPassword(e.target.value)} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="confirm_password">
              <Form.Label column sm={5}>Confirm New Password: </Form.Label>
              <Col sm={7}>
                <Form.Control name="confirm_password" type="password" defaultValue='' onChange={(e) => setConfirmNewPassword(e.target.value)} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="phone_provider">
              <Col sm={12} className="text-center m-3">
                <Button type="submit" className="btn-success">Submit</Button>
              </Col>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    )
  } else {
    return(
      <Card className="text-center" style={{ height: 'max-content', width: '20em', backgroundColor: '#c1e3ff' }}>
        <Card.Header className="d-flex justify-content-between">
          <Button variant='dark' onClick={() => setEdit(true)}>Edit</Button>
          <Button variant='danger' onClick={handleDelete}>Delete</Button>
        </Card.Header>
        <Card.Body>
          <p>Username: {username}</p>
          <p>Email: {email}</p>
          <p>Phone: {phone}</p>
          <p>Phone Provider: {providers[phoneProvider]}</p>
        </Card.Body>
      </Card>
    )
  }
}
export default User
