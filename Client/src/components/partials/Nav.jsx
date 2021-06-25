import React, { useState, useEffect } from 'react'

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

import '../../styles/nav.scss'

const Nav = () => {
  const [categories, setCategories] = useState(null)
  const mql = window.matchMedia('(max-width: 600px)')

  useEffect(() => {
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => {
        setCategories(data.categories)
      })
  }, [])

  if(mql.matches) {
    return (
      <Accordion className="nav-wrapper">
        <Card>
          <Accordion.Toggle as={Card.Header} className="p-0 text-center" variant="link" eventKey={'categories'}>Categories <strong>&darr;</strong></Accordion.Toggle>

        {categories !== null &&
          <>
            {categories.map((category) => (
              <Accordion.Collapse eventKey={'categories'}>
                  <a href={"/category/" + category.id } className='btn-nav'>{category.category_name}</a>
              </Accordion.Collapse>
            ))}
          </>
        }
        </Card>
      </Accordion>
    )
  } else {
    return (
      <Accordion className="nav-wrapper">

        {categories !== null &&
          <>
            {categories.map((category) => (
              <Card>
                <Accordion.Toggle as={Card.Header} className="p-0" variant="link" eventKey={'categories'}>
                  <a href={"/category/" + category.id } className='btn-nav'>{category.category_name}</a>
                </Accordion.Toggle>
              </Card>
            ))}
          </>
        }

      </Accordion>
    )
  }
}
export default Nav
