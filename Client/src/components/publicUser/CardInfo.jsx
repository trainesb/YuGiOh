import React, { useState, useEffect } from 'react'

const CardInfo = (props) => {
  const [userId] = useState(props.userId)
  const [total, setTotal] = useState(null)
  const [numCardsOwned, setNumCardsOwned] = useState(null)
  const [numUniqueCards, setNumUniqueCards] = useState(null)

  useEffect(() => {
    fetch('/api/totalWorth/' + userId)
      .then(response => response.json())
      .then(data => setTotal(data.total))

    fetch('/api/user/' + userId + '/numCardsOwned')
      .then(response => response.json())
      .then(data => {
        setNumCardsOwned(data.num_cards)
        setNumUniqueCards(data.num_unique_cards)
      })
  }, [])

  return (
    <div className="user-card-info-wrapper">
      <p>Total: ${total !== null && total.toFixed(2)}</p>
      <p>Number of Cards Owned: {numCardsOwned} </p>
      <p>Number of Unique Cards Owned: {numUniqueCards}</p>
    </div>
  )
}
export default CardInfo
