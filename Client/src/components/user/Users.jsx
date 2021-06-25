import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'

import Loading from '../partials/Loading'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data.users))
      .then(() => setLoading(false))
  }, [])

  return(
    <div style={{backgroundColor: '#C5D7E8', width: '100%', height: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap'}}>
      {loading
        ? <Loading />
        : users.map((user) => (
          <a href={'/user/' + user.username}>
            <Card style={{border: 'solid thin #000', borderRadius: '0.5rem', margin: '0.5rem'}}>
              <Card.Body>
                <h2>{user.username}</h2>
              </Card.Body>
            </Card>
          </a>
        ))
      }
    </div>
  )

}
export default Users
