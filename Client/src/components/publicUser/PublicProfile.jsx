import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import CardInfo from './CardInfo'
import CardsOwned from './CardsOwned'
import TopCards from './TopCards'
import SearchUsersCards from './SearchUsersCards'

import '../../styles/publicProfile.scss'

const PublicProfile = (props) => {
  const [username] = useState(props.username)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/username/' + username)
      .then(response => response.json())
      .then(data => {
        console.log(data.user)
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
export default PublicProfile
