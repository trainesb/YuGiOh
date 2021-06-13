import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'

import '../styles/categories.scss'

const SetCategory = () => {
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    fetch('/api/setCategories')
      .then(response => response.json())
      .then(data => {
        if(data.status){
          setCategories(data.categories)
        }
      })
  }, [])

  return (
    <div className="categories-wrapper">
      {categories !== null &&
        <>
          {categories.map((category) => (
            <Card>
              <Card.Header className="text-center"><Card.Title>{category[0]}</Card.Title></Card.Header>
              <Card.Body className="category-wrapper">
                {category[1].map((set) => (
                  <a href={"/set/" + set.id}>
                  <Card className="category">
                    <Card.Header>{set.set_name}</Card.Header>
                    <Card.Body>
                      <p>{set.num_owned} / {set.num_of_cards}</p>
                    </Card.Body>
                    <Card.Footer>
                      <p className="set-date">{set.tcg_date}</p>
                      <p className="set-code">({set.set_code})</p>
                    </Card.Footer>
                  </Card>
                  </a>
                ))}
              </Card.Body>
            </Card>
          ))}
        </>
      }
    </div>
  )
}
export default SetCategory
