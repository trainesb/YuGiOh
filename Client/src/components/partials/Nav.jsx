import React, { useState, useEffect } from 'react'

import { A } from 'hookrouter'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

import '../../styles/nav.scss'

const Nav = () => {
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => {
        setCategories(data.categories)
      })
  }, [])

  function handleLogout(event) {
    event.preventDefault()

    fetch('/api/user/logout')
      .then(() => {
        sessionStorage.removeItem('User')
      })
      .then(() => window.location.assign('/'))
  }

  return(
    <Accordion className="nav-wrapper">
      <Card>
        <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'home'}>
          <a className="btn-nav" href="/">Home</a>
        </Accordion.Toggle>
      </Card>

      <Card>
        <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'users'}>
          <a className="btn-nav" href="/users">Users</a>
        </Accordion.Toggle>
      </Card>

      <Card>
        <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'about'}>
          <a className="btn-nav" href="/about">About</a>
        </Accordion.Toggle>
      </Card>

      <Card>
        <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'contact'}>
          <a className="btn-nav" href="/contact">Contact</a>
        </Accordion.Toggle>
      </Card>

      {categories !== null &&
        <>
          <Card>
            <Accordion.Toggle className="nav-acr" as={Card.Header} variant="link" eventKey={'categories'}>Categories</Accordion.Toggle>
            {categories.map((category) => (
              <Card className="no-border">
                <Accordion.Collapse eventKey={'categories'}>
                  <A href={"/category/" + category.id } className='btn-nav'>{category.category_name}</A>
                </Accordion.Collapse>
              </Card>
            ))}
          </Card>
        </>
      }

      <Card>
        <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'logout'}>
          <a className="btn-nav" onClick={handleLogout}>Logout</a>
        </Accordion.Toggle>
      </Card>

      <Card>
          <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'profile'}>
            <a href="/profile" className='btn-nav'>Profile</a>
          </Accordion.Toggle>
        </Card>
    </Accordion>
  )
}
export default Nav
