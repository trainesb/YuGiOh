import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'

import '../styles/categories.scss'

const SetCategory = () => {
  const [categories, setCategories] = useState(null)
  const [total, setTotal] = useState(0.0)

  useEffect(() => {
    fetch('/api/top/categories')
      .then(response => response.json())
      .then(data => {
        if(data.status){
          setCategories(data.top_sets)
        }
      })

      fetch('/api/totalWorth')
        .then(response => response.json())
        .then(data => setTotal(data.total))
  }, [])

  return (
    <div className="categories-wrapper">
      <Card>
        <Card.Header>
          <Card.Title>Total Worth: ${total.toFixed(2)}</Card.Title>
        </Card.Header>
      </Card>

      {categories !== null &&
        <Card>
          <Card.Header className="text-center"><Card.Title>Almost Completed Sets</Card.Title></Card.Header>
          <Card.Body className="category-wrapper">
            {categories.map((set) => (
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
      }
    </div>
  )
}
export default SetCategory
