import React, { useState, useEffect } from 'react'

import SmallCard from './SmallCard'

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
    <div className="text-center">
      <a href="/" className="home-btn">Home</a>
      { cardset !== null &&
        <>
          <h2>({cardset.set_code}) - {cardset.set_name} - [{cardset.num_of_cards}]</h2>
          <p className="text-center">{cardset.tcg_date}</p>
        </>
      }
      <div className="small-card-wrapper">
        {cardMaps.map((map) => <SmallCard setMapId={map.id} cardId={map.card_id} rarityId={map.rarity_id} price={map.card_price} numOwned={map.num_owned} cardCode={map.card_code} />)}
      </div>
    </div>
  )
}
export default Cards
