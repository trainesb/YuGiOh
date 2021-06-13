import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../styles/singleCard.scss'

const SingleCard = (props) => {
  const [cardSetMap, setCardSetMap] = useState(null)
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
      })
  }, [])

  const handleAddOwned = (event) => {
    event.preventDefault()

    fetch('/api/addOwnedCard/' + cardSetMap.id)
      .then(response => response.json())
      .then(data => setCardSetMap(prevState => ({...prevState, ["num_owned"]: data.num_owned}) ))
  }

  const handleRemoveOwned = (event) => {
    event.preventDefault()

    fetch('/api/removeOwnedCard/' + cardSetMap.id)
      .then(response => response.json())
      .then(data => setCardSetMap(prevState => ({...prevState, ["num_owned"]: data.num_owned}) ))
  }

  return (
    <div className="single-card-wrapper">
      {card !== null &&
        <Card>
          <Card.Header>
            <a className="back-btn" href={'/set/' + cardSetMap.card_set_id}>Back</a>
            <Card.Title>{card.name}</Card.Title>
          </Card.Header>
          <Card.Body>

            <div>
              <p><img src={'../../' + card.image} /></p>
            </div>

            <div>
              {rarity !== null && <p>{rarity.rarity} - {rarity.rarity_code}</p>}
              <p>Type: {card.type}</p>


              <p>Level: {card.level}</p>
              <p>Race: {card.race}</p>
              <p>Attribute: {card.attribute}</p>
              {archetype !== null &&
                <p>Archetype Name: {archetype.archetype_name}</p>
              }


              <p>Atk: {card.atk}</p>
              <p>Def: {card.defense}</p>
              <p>Owned: {cardSetMap.num_owned}</p>

              <>
                <button className="add-card-owned" onClick={handleAddOwned}>+</button>
                <button className="remove-card-owned" onClick={handleRemoveOwned}>-</button>
              </>
            </div>
          </Card.Body>
          <Card.Footer>
            <p><strong>Description:</strong> {card.desc}</p>
          </Card.Footer>
        </Card>
      }
    </div>
  )
}
export default SingleCard
