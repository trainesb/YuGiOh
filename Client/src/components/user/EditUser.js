import React, { useState } from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

const EditUser = (props) => {
  const [id] = useState(props.id)
  const [username, setUsername] = useState(props.username)
  const [phone, setPhone] = useState(props.phone)
  const [phoneProvider, setPhoneProvider] = useState(props.phoneProvider)
  const [email, setEmail] = useState(props.email)

  const handleSubmit = (event) => {
    event.preventDefault()

    const headers = {
      method: 'PUT',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        id: id,
        username: username,
        phone: phone,
        phoneProvider: phoneProvider,
        email: email,
      })
    }

    fetch('/api/user', headers)
      .then(response => response.json())
      .then(data => {
        if(data.status) {
          alert(username + "'s profile has been updated successfully!'")
          props.onHide()
        } else {
          alert(data.error)
        }
      })
  }

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Edit { username }'s Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <label for="username">Username:</label>
          <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} value={username} />
          <br />

          <label for="phone">Phone Number:</label>
          <input type="tel" name="phone" onChange={(e) => setPhone(e.target.value)} value={phone} />
          <br />

          <label for="phone-provider">Phone Provider:</label>
          <select name="phone-provider" onChange={(e) => setPhoneProvider(e.target.value)} defaultValue={phoneProvider}>
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
          </select>
          <br />

          <label for="email">Email:</label>
          <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} />
          <br />

          <input type="submit" value="Update" />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}
export default EditUser
