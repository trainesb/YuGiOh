import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import CardData from './CardData'
import '../../styles/cardsOwned.scss'

const CardsOwned = (props) => {
  const [userId] = useState(props.userId)
  const [ownedCards, setOwnedCards] = useState(null)

  useEffect(() => {
    fetch('/api/user/' + userId + '/allCardsOwned')
      .then(response => response.json())
      .then(data => setOwnedCards(data.cards))
  }, [])

  return (
    <>
      <h2 className="text-center">All Owned Cards</h2>
      <hr />
      <div className="owned-cards-wrapper">

        {ownedCards !== null &&
          <>
            {ownedCards.map((set) => (
              <Card>
                <Card.Header className="text-center">
                  <Card.Title><strong>{set.set_name}</strong> - ({set.set_code}) - [{set.num_of_cards}]</Card.Title>
                  <Card.Title>{set.tcg_date}</Card.Title>
                </Card.Header>
                <Card.Body>
                  {set.cards_owned.map((card) => (
                    <CardData card={card} />
                  ))}
                </Card.Body>
              </Card>
            ))}
          </>
        }
      </div>
    </>
  )
}
export default CardsOwned
