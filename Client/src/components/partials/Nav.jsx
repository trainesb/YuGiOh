import React, { useState, useEffect } from 'react'

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
      {categories !== null &&
        <>
          {categories.map((category) => (
            <Card>
              <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={category.id}>
                <a href={"/category/" + category.id } className='btn-nav'>{category.category_name}</a>
              </Accordion.Toggle>
            </Card>
          ))}
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
