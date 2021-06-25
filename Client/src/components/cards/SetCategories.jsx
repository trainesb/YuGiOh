import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import CardInfo from '../publicUser/CardInfo'
import CardsOwned from '../publicUser/CardsOwned'
import TopCards from '../publicUser/TopCards'
import SearchUsersCards from '../publicUser/SearchUsersCards'

import '../../styles/publicProfile.scss'

const SetCategories = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/user/' + sessionStorage.getItem('User'))
      .then(response => response.json())
      .then(data => {
        setUser(data.user)
      })

  }, [])

  return (
    <Card className="public-profile-wrapper">
      <Card.Header>
        <Card.Title className="text-center">{user && <strong>{user.username}</strong>}`s Card Archive!</Card.Title>
      </Card.Header>
      <Card.Body>
        {user !== null &&
          <>
            <CardInfo userId={user.id} />
            <SearchUsersCards userId={user.id} />
            <TopCards userId={user.id} />
            <CardsOwned userId={user.id} />
          </>
        }
      </Card.Body>
    </Card>
  )
}
export default SetCategories
