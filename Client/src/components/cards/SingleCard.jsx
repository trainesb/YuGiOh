import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../../styles/singleCard.scss'

const SingleCard = (props) => {
  const [cardSetMap, setCardSetMap] = useState(null)
  const [numOwned, setNumOwned] = useState(0)
  const [card, setCard] = useState(null)
  const [cardSet, setCardSet] = useState(null)
  const [archetype, setArchetype] = useState(null)
  const [rarity, setRarity] = useState(null)

  useEffect(() => {
    fetch('/api/setMap/' + props.setMapId)
      .then(response => response.json())
      .then(data => {
        setCardSetMap(data.map)

        fetch('/api/card/' + data.map.card_id)
          .then(response => response.json())
          .then(data => {
            setCard(data.card)

            if(data.card !== null && data.card.archetype_id) {
              fetch('/api/archetype/' + data.card.archetype_id)
                .then(response => response.json())
                .then(data => setArchetype(data.archetype))
            }
          })

        fetch('/api/rarity/' + props.rarityId)
          .then(response => response.json())
          .then(data => setRarity(data.rarity))

        fetch('/api/card/numOwned/' + data.map.card_set_id  + '/' + data.map.id)
          .then(response => response.json())
          .then(data => setNumOwned(data.num_owned))
      })
  }, [])

  const handleAddOwned = (event) => {
    event.preventDefault()

    fetch('/api/addOwnedCard/' + cardSetMap.id)
      .then(response => response.json())
      .then(data => setNumOwned(data.num_owned) )
  }

  const handleRemoveOwned = (event) => {
    event.preventDefault()

    fetch('/api/removeOwnedCard/' + cardSetMap.id)
      .then(response => response.json())
      .then(data => setNumOwned(data.num_owned) )
  }

  return (
    <div className="single-card-wrapper">
      {card !== null &&
        <Card>
          <Card.Header>
            <Card.Title className="text-center"><h2 className="text-center"><strong>{cardSetMap.set.set_name}</strong></h2></Card.Title>
          </Card.Header>
          <Card.Body>

            <div>
              <p><img src={'../../' + card.image} /></p>
            </div>


            <div>
              <div className="card-title">
                <h3 className="text-center"><strong>{card.name}</strong></h3>
                <hr />
              </div>

              <div className="info">
                {rarity !== null && <p>{rarity.rarity} - {rarity.rarity_code}</p>}
                <p><strong>Type:</strong> {card.type}</p>


                <p><strong>Level:</strong> {card.level}</p>
                <p><strong>Race:</strong> {card.race}</p>
                <p><strong>Attribute:</strong> {card.attribute}</p>
                {archetype !== null &&
                  <p>Archetype Name: {archetype.archetype_name}</p>
                }

                <p><strong>Atk:</strong> {card.atk} <strong className="def">Def:</strong> {card.defense}</p>

                <p><strong>Description:</strong> {card.desc}</p>
              </div>

              <div className="num-owned-wrapper">
                <p><strong>Number Owned:</strong> {numOwned}</p>

                <button className="add-card-owned" onClick={handleAddOwned}>+</button>
                <button className="remove-card-owned" onClick={handleRemoveOwned}>-</button>

                <br />

                <p><strong>Price:</strong> ${cardSetMap.card_price.toFixed(2)}</p>
                <p><strong>Total:</strong> ${cardSetMap.card_price.toFixed(2) * numOwned}</p>
              </div>

            </div>
          </Card.Body>
        </Card>
      }
    </div>
  )
}
export default SingleCard
