import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

import AddUserForm from './AddUserForm'
import VerificationMethod from './VerificationMethod'
import VerificationCode from './VerificationCode'

const Register = (props) => {
  const [step, setStep] = useState(0)
  const [username, setUsername] = useState(null)

  return(
    <Card>
      <Card.Header>
        <Card.Title>Register</Card.Title>
      </Card.Header>
      <Card.Body style={{margin: '0 auto'}}>

        {step === 0 && <AddUserForm setStep={setStep} setUsername={setUsername} />}
        {step === 1 && <VerificationMethod setStep={setStep} username={username} />}
        {step === 2 && <VerificationCode onHide={props.onHide} username={username} />}
      </Card.Body>
    </Card>
  )
}
export default Register
