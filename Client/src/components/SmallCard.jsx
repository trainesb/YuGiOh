import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'

import '../styles/smallCard.scss'

const SmallCard = (props) => {
  const [setMapId] = useState(props.setMapId)
  const [price] = useState(props.price)
  const [cardCode] = useState(props.cardCode)
  const [numOwned, setNumOwned] = useState(props.numOwned)
  const [card, setCard] = useState(null)
  const [rarity, setRarity] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    fetch('/api/rarity/' + props.rarityId)
      .then(response => response.json())
      .then(data => setRarity(data.rarity))

    fetch('/api/card/' + props.cardId)
      .then(response => response.json())
      .then(data => {
        setCard(data.card)
      })
  }, [])

  const handleAddOwned = (event) => {
    event.preventDefault()

    fetch('/api/addOwnedCard/' + setMapId)
      .then(response => response.json())
      .then(data => setNumOwned(data.num_owned))
  }

  const handleRemoveOwned = (event) => {
    event.preventDefault()

    fetch('/api/removeOwnedCard/' + setMapId)
      .then(response => response.json())
      .then(data => setNumOwned(data.num_owned))
  }

  return (
    <div>
      {card !== null &&
        <Card className="small-card">
          <Card.Header><a href={'/card/' + setMapId}>{card.name}</a></Card.Header>
          <Card.Body className={`card-wrapper ${numOwned < 1 ? "opac" : ""}`} onMouseEnter={() => setShowAdd(true)} onMouseLeave={() => setShowAdd(false)}>
            {rarity !== null && <p className="card-rarity">{rarity.rarity_code}</p>}
            <img src={'../../' + card.image_small} />
            <p className="numOwned">{numOwned}</p>

            {showAdd &&
              <>
                <button className="add-card-owned" onClick={handleAddOwned}>+</button>
                <button className="remove-card-owned" onClick={handleRemoveOwned}>-</button>
              </>
            }
          </Card.Body>
          <Card.Footer>
            <p className="cardCode">{cardCode}</p>
            <p className="cardPrice">${price}</p>
          </Card.Footer>
        </Card>
      }
    </div>
  )
}
export default SmallCard
