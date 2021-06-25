import React, { useState, useRef, useEffect } from 'react'

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import searchIcon from '../../../public/images/icons/search.png'
import PublicCardSearch from './PublicCardSearch'

const SearchUsersCards = (props) => {
  const [userId] = useState(props.userId)
  const outer = useRef()
  const [srch, setSrch] = useState('')
  const [found, setFound] = useState([])
  const [showFound, setShowFound] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [cardId, setCardId] = useState(null)

  useEffect(() => {
    document.addEventListener("mousedown", handleClick)

    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [])

  const handleClick = (e) => {
    if (outer.current.contains(e.target)) {
      // inside click
      setShowFound(true)
      return
    }

    //outside click
    setShowFound(false)
  }

  const handleChange = (event) => {
    setSrch(event.target.value)

    const headers = {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({search: event.target.value})
    }

    fetch('/api/search', headers)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setFound(data.cards)
      })
  }

  const handleShowCard = (e) => {
    e.preventDefault()

    setCardId(e.target.id)
    setShowCard(true)
  }

  return (
    <div className="search-users-cards" ref={outer}>
      <Card className="top-nav-link">
        <Card.Title className="text-center"><strong>Search User's Cards</strong></Card.Title>
        <Accordion.Toggle as={Card.Header} className="search-wrapper" variant="link" eventKey={'logout'}>
          <input className="search-input" type="text" value={srch} onChange={handleChange}/>
          <img className="search-icon" src={searchIcon} />
        </Accordion.Toggle>
      </Card>

      {found && showFound &&
        <div className="found-wrapper">
          {found.map((card) => (
            <div className="found-link">
              <p id={card.id} onClick={handleShowCard}>{card.name}</p>
            </div>
          ))}
        </div>
      }

      {userId && cardId && <PublicCardSearch show={showCard} onHide={() => setShowCard(false)} cardId={cardId} userId={userId} />}


    </div>
  )
}
export default SearchUsersCards
