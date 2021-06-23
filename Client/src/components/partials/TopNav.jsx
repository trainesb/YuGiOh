import React from 'react'

import '../../styles/topNav.scss'

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Search from './Search'

const TopNav = () => {

  const handleLogout = (event) => {
    event.preventDefault()

    fetch('/api/user/logout')
      .then(() => {
        sessionStorage.removeItem('User')
      })
      .then(() => window.location.assign('/'))
  }

  return (
    <Accordion className="top-nav-wrapper">
      <Card className="top-nav-link">
        <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'home'}>
          <a className="btn-nav" href="/">Home</a>
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

      <Card className="top-nav-link">
        <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'contact'}>
          <a className="btn-nav" href="/contact">Contact</a>
        </Accordion.Toggle>
      </Card>

      <Card className="top-nav-link">
        <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'profile'}>
          <a className="btn-nav" href="/profile">Profile</a>
        </Accordion.Toggle>
      </Card>

      <Card className="top-nav-link">
        <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'logout'}>
          <a className="btn-nav" onClick={handleLogout}>Logout</a>
        </Accordion.Toggle>
      </Card>

      <Search />
    </Accordion>
  )
}
export default TopNav
