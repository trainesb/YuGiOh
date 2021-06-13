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
    </Accordion>
  )
}
export default Nav
