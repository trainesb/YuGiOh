import React from 'react'

import '../../styles/topNav.scss'

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Search from './Search'

const PublicTopNav = () => {

  return (
    <Accordion className="top-nav-wrapper">
      <Card className="top-nav-link">
        <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'home'}>
          <a className="btn-nav" href="/login">Login</a>
        </Accordion.Toggle>
      </Card>

      <Card className="top-nav-link">
        <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'home'}>
          <a className="btn-nav" href="/register">Register</a>
        </Accordion.Toggle>
      </Card>

      <Card className="top-nav-link">
        <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'users'}>
          <a className="btn-nav" href="/users">Users</a>
        </Accordion.Toggle>
      </Card>

      <Card className="top-nav-link">
        <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'about'}>
          <a className="btn-nav" href="/about">About</a>
        </Accordion.Toggle>
      </Card>

    </Accordion>
  )
}
export default PublicTopNav
