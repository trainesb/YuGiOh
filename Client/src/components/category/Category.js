import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import Card from 'react-bootstrap/Card'

import { getSetsByCategoryName } from '../../services/CategoriesService'

const Category = () => {
  const { cat } = useParams()
  const [sets, setSets] = useState([])

  useEffect(() => {
    getSetsByCategoryName(cat).then(data => setSets(data))
  }, [cat])

  return (
    <div className="category-wrapper">
      <div className="title">
        <h1>{cat.replace(/-/g, ' ')}</h1>
      </div>

      <ul className="card-wrapper">
        {sets.length > 0 &&
          sets.map((set) => (
            <li key={set.id} className="set">
              <Link as={Card} to={'/set/' + set.set_code}>
                <Card.Header className="title">
                  <Card.Title>{set.set_name}</Card.Title>
                </Card.Header>

                <Card.Body className="card-image">
                  {set.image && <img src={'/images/images/' + set.image} />}
                </Card.Body>

                <Card.Footer>
                  <h3>{set.set_code}</h3>
                  <p>Number Of Cards: {set.num_of_cards}</p>
                  <p>TCG Date: {set.tcg_date}</p>
                </Card.Footer>
              </Link>
            </li>
          ))
        }
      </ul>

    </div>
  )
}
export default Category
