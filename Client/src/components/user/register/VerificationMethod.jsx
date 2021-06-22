import React, { useState, useEffect } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

const VerificationMethod = (props) => {
  const [verficationMethod, setVerficationMethod] = useState('email')

  function handleSubmit(event) {
    event.preventDefault()

    fetch('/api/register/verification/' + verficationMethod + '/' + props.username)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        props.setStep(2)
      })
  }

  return (
    <Form className="p-4" onSubmit={handleSubmit} style={{ width: 'fit-content', margin: '0 auto' }}>
      <Form.Row className="text-center">
        <Col sm={12}>
          <h2>Verify You Are Human!</h2>
          <p>Please choose a method to recieve verification code.</p>
        </Col>
      </Form.Row>

      <Form.Row>
        <Form.Label column sm={5}>Verfication Method</Form.Label>
        <Col sm={7}>
          <Form.Check type='radio' label='Phone' name='phone' id='phone' checked={verficationMethod === 'phone'} onChange={(e) => setVerficationMethod(e.target.id)} />
          <Form.Check type='radio' label='Email' name='email' id='email' checked={verficationMethod === 'email'} onChange={(e) => setVerficationMethod(e.target.id)} />
        </Col>
      </Form.Row>

      <Form.Row className="mt-3">
        <Button sm={12} className="text-center m-auto btn-success" type="submit">Send Verification Code</Button>
      </Form.Row>
    </Form>
  )
}
export default VerificationMethod
