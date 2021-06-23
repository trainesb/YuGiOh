import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'

import '../../styles/publicProfile.scss'

const PublicProfile = (props) => {
  const [userId] = useState(props.userId)
  const [total, setTotal] = useState(0.0)
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    fetch('/api/user/' + userId)
      .then(response => response.json())
      .then(data => {
        console.log(data.user)
        setUser(data.user)
      })

    fetch('/api/totalWorth/' + userId)
      .then(response => response.json())
      .then(data => setTotal(data.total))

    fetch('/api/user/' + userId + '/top')
      .then(response => response.json())
      .then(data => {
        if(data.status){
          setCategories(data.top_sets)
        }
      })
  }, [])

  return (
    <Card className="public-profile-wrapper">
      <Card.Header>
        <Card.Title>{user && user.username}`s Card Archive!</Card.Title>
      </Card.Header>
      <Card.Body>
        <p>Total: {total.toFixed(2)}</p>
      </Card.Body>

      {categories !== null &&
        <Card>
          <Card.Header className="text-center"><Card.Title>Almost Completed Sets</Card.Title></Card.Header>
          <Card.Body className="category-wrapper">
            {categories.map((set) => (
              <a href={"/set/" + set.id}>
              <Card className="category">
                <Card.Header>{set.set_name}</Card.Header>
                <Card.Body>
                  <p>{set.num_owned} / {set.num_of_cards}</p>
                </Card.Body>
                <Card.Footer>
                  <p className="set-date">{set.tcg_date}</p>
                  <p className="set-code">({set.set_code})</p>
                </Card.Footer>
              </Card>
              </a>
            ))}
          </Card.Body>
        </Card>
      }
    </Card>
  )
}
export default PublicProfile
