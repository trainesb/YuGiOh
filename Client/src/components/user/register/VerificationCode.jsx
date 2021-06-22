import React, { useState, useEffect } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

import Loading from '../../partials/Loading'

const VerificationCode = (props) => {
  const [verficationCode, setVerficationCode] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    setLoading(true)
    fetch('/api/register/code/' + verficationCode + '/' + props.username)
      .then(response => response.json())
      .then(data => {
        setLoading(false)
        if(data.status) {
          alert('Confirmation Successfull!')
          window.location.reload()
        } else {
          alert('Error: ' + data.error)
        }
      })
  }

  if (loading) {
    <Loading />
  }

  return (
    <Form className="p-4" onSubmit={handleSubmit} style={{ width: 'fit-content', margin: '0 auto' }}>
      <Form.Row className="text-center">
        <Col sm={12}>
          <h2>Verify You Are Human!</h2>
          <p>Please Enter The Verification Code Below.</p>
        </Col>
      </Form.Row>

      <Form.Row>
        <Form.Label column sm={5}>Verfication Method</Form.Label>
        <Col sm={7}>
          <Form.Control type="text" id="code" name="code" onChange={(e) => setVerficationCode(e.target.value)} />
        </Col>
      </Form.Row>

      <Form.Row className="mt-3">
        <Button sm={12} className="text-center m-auto btn-success" type="submit">Send Verification Code</Button>
      </Form.Row>
    </Form>
  )
}
export default VerificationCode
