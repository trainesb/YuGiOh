import React, { useState, useEffect } from 'react'

import SmallCard from './SmallCard'
import Card from 'react-bootstrap/Card'

const Cards = (props) => {
  const [setId] = useState(props.setId)
  const [cardset, setCardSet] = useState(null)
  const [cardMaps, setCardMaps] = useState([])

  useEffect(() => {
    fetch('/api/cardset/' + setId)
      .then(response => response.json())
      .then(data => setCardSet(data.cardset))

    fetch('/api/cards/from/setMap/' + setId)
      .then(response => response.json())
      .then(data => setCardMaps(data.maps))
  }, [])

  return (
    <Card className="text-center">
      <Card.Header>
        { cardset !== null &&
          <>
            <Card.Title><strong>({cardset.set_code}) - {cardset.set_name} - [{cardset.num_of_cards}]</strong></Card.Title>
            <Card.Title className="text-center">{cardset.tcg_date}</Card.Title>
          </>
        }
      </Card.Header>
      <Card.Body className="small-card-wrapper">
        {cardMaps.map((map) => <SmallCard setMapId={map.id} cardId={map.card_id} rarityId={map.rarity_id} price={map.card_price} numOwned={map.num_owned} cardCode={map.card_code} />)}
      </Card.Body>
    </Card>
  )
}
export default Cards
