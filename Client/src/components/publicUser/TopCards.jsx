import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import CardData from './CardData'
import '../../styles/cardsOwned.scss'

const TopCards = (props) => {
  const [userId] = useState(props.userId)
  const [topCards, setTopCards] = useState(null)

  useEffect(() => {
    fetch('/api/user/' + userId + '/topCardsOwned')
      .then(response => response.json())
      .then(data => setTopCards(data.cards))
  }, [])

  return (
    <>
      <h2 className="text-center">Top 10 Cards</h2>
      <hr />
      <div className="owned-cards-wrapper">

        {topCards !== null && topCards.map((card) => <CardData card={card} />)}
      </div>
    </>
  )
}
export default TopCards
