import React, { useRef, useEffect, useState } from 'react'

const CardData = (props) => {
  const ref = useRef()
  const [card] = useState(props.card)
  const [show, setShow] = useState(false)

  useEffect(() => {
    document.addEventListener("mouseover", handleClick)

    return () => {
      document.removeEventListener("mouseover", handleClick)
    }
  }, [])

  const handleClick = (e) => {
    if (ref.current.contains(e.target)) {
      // inside click
      setShow(true)
      return
    }

    //outside click
    setShow(false)
  }

  return (
    <div className="public-card-wrapper" ref={ref}>
      <img src={'../../' + card.card.image_small} />
      <p className="num-owned">{card.num_owned}</p>

      {show &&
        <div className="card-data">
          <p><strong>{card.card.name}</strong></p>
          <p>Code: ({card.card_code})</p>
          <p>Price: ${card.card_price.toFixed(2)}</p>
          <p>Num Owned: {card.num_owned}</p>
        </div>
      }
    </div>
  )
}
export default CardData
