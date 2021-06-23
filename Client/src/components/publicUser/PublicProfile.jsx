import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import CardInfo from './CardInfo'
import CardsOwned from './CardsOwned'

import '../../styles/publicProfile.scss'

const PublicProfile = (props) => {
  const [userId] = useState(props.userId)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/user/' + userId)
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
        <CardInfo userId={userId} />
        <CardsOwned userId={userId} />
      </Card.Body>
    </Card>
  )
}
export default PublicProfile
