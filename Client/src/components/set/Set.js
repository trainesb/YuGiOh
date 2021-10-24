import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCardsBySetCode, getSetByCode } from '../../services/SetServices'

import Card from 'react-bootstrap/Card'

const Set = () => {
  const { setCode } = useParams()
  const [ set, setSet ] = useState(null)
  const [ cards, setCards ] = useState([])

  useEffect(() => {
    getSetByCode(setCode).then(data => setSet(data))
    getCardsBySetCode(setCode).then(data => setCards(data))
  }, [setCode])

  return (
    <div className="set-cards-wrapper">
      <div className="title">
        <h1>{set !== null && set.set_name}</h1>
      </div>

      <ul className="sets-wrapper">
        {cards.length > 0 &&
          cards.map((card) => (
            <li key={card.id} className="set">
              <Card>
                <Card.Header className="title">
                  <Card.Title>{card.name}</Card.Title>
                </Card.Header>

                <Card.Body className="card-image">
                  <p className="rarity-code">{card.rarity_code}</p>
                  <img src={'/images/images/cards_small/' + card.image_small} alt={card.image_small} />
                </Card.Body>

                <Card.Footer>
                  <p className="card-code">{card.card_code}</p>
                </Card.Footer>
              </Card>



            </li>
          ))
        }
      </ul>

    </div>
  )
}
export default Set
