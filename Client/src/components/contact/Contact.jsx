import React, { useEffect, useState } from 'react'

import '../../styles/contact.scss'

import Card from 'react-bootstrap/Card'

const Contact = () => {
  const [msg, setMsg] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const headers = {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({msg: msg})
    }

    fetch('/api/contact', headers)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if(data.status) {
          alert('Message has been sent!')
          window.location.reload()
        }
      })
  }

  return (
    <Card className="contact-wrapper">
      <Card.Header>
        <Card.Title className="text-center"><h2>Contact</h2></Card.Title>
      </Card.Header>
      <Card.Body className="text-center">
        <p><strong>*Note:</strong> this site was thrown togeather quickly, and is far from perfect! Considering how this site performs there may be updates to come.</p>
        <br />

        <form className="cntact-form" onSubmit={handleSubmit}>
          <label for="contact-msg"><strong>If you have suggestions for future updates or comments, please explain them below.</strong></label>
          <br />
          <textarea name="contact-msg" rows="8" cols="50" onChange={(e) => setMsg(e.target.value)}></textarea>
          <br />
          <br />
          <input type="submit" value="Send" />
        </form>
      </Card.Body>
    </Card>
  )
}
export default Contact
