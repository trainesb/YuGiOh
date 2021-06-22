import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'

import '../../styles/category.scss'

const Category = (props) => {
  const [categoryId] = useState(props.categoryId)
  const [category, setCategory] = useState(null)
  const [sets, setCardSets] = useState(null)

  useEffect(() => {
    fetch('/api/category/' + categoryId)
      .then(response => response.json())
      .then(data => setCategory(data.category))

    fetch('/api/category/to/set/' + categoryId)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setCardSets(data.sets)
      })
  }, [])

  return (
    <Card className="category-wrapper">
      <Card.Header className="text-center"><Card.Title>{category !== null && category.category_name}</Card.Title></Card.Header>
      <Card.Body>
        {sets !== null &&
          <>
            {sets.map((set) => (
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
          </>
        }
      </Card.Body>
    </Card>
  )
}
export default Category
