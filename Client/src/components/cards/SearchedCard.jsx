import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import '../../styles/SearchedCard.scss'

const SearchedCard = (props) => {
  const [cardId] = useState(props.cardId)
  const [card, setCard] = useState(null)
  const [cardMaps, setCardMaps] = useState(null)

  useEffect(() => {
    fetch('/api/searched/card/' + cardId)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setCard(data.card)
        setCardMaps(data.maps)
      })
  }, [])

  return (
    <div className="searched-card-wrapper">

      {card !== null &&
        <Card>
          <Card.Header>
            <Card.Title className="text-center">{card.name}</Card.Title>
          </Card.Header>
          <Card.Body>


            <div>
              <p><img src={'../../' + card.image} /></p>
            </div>


            <div>
              <div className="info">
                <p><strong>Type:</strong> {card.type}</p>


                <p><strong>Level:</strong> {card.level}</p>
                <p><strong>Race:</strong> {card.race}</p>
                <p><strong>Attribute:</strong> {card.attribute}</p>


                <p><strong>Atk:</strong> {card.atk} <strong className="def">Def:</strong> {card.defense}</p>

                <p><strong>Description:</strong> {card.desc}</p>
              </div>

              {cardMaps &&
                <div className="map-info">
                  <p className="map-info-title"><strong>Sets</strong></p>
                  <hr />
                  <ul>
                    {cardMaps.map((cardMap) => (
                      <li><a href={'/card/' + cardMap.id}>{cardMap.set && cardMap.set.set_name} - ({cardMap.card_code}) - {cardMap.rarity && cardMap.rarity.rarity_code} - ${cardMap.card_price.toFixed(2)} - Num Owned: {cardMap.num_owned}</a></li>
                    ))}
                  </ul>
                </div>
              }
            </div>


          </Card.Body>
          <Card.Footer>

          </Card.Footer>
        </Card>
      }

    </div>
  )
}
export default SearchedCard
