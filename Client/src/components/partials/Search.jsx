import React, { useState, useRef, useEffect } from 'react'

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import searchIcon from '../../../public/images/icons/search.png'

const Search = () => {
  const outer = useRef()
  const [srch, setSrch] = useState('')
  const [found, setFound] = useState([])
  const [showFound, setShowFound] = useState(false)

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

  return (
    <div className="search" ref={outer}>
      <Card className="top-nav-link">
        <Accordion.Toggle as={Card.Header} className="search-wrapper" variant="link" eventKey={'logout'}>
          <input type="text" value={srch} onChange={handleChange}/>
          <img className="search-icon" src={searchIcon} />
        </Accordion.Toggle>
      </Card>

      {found && showFound &&
        <div className="found-wrapper">
          {found.map((card) => (
            <div className="found-link">
              <a href={'/searched/card/' + card.id}>{card.name}</a>
            </div>
          ))}
        </div>
      }
    </div>
  )
}
export default Search
