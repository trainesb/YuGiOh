import React, { useState, useEffect } from 'react'
import User from './User.jsx'
import Loading from '../partials/Loading.jsx'

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
    <div style={{backgroundColor: '#C5D7E8', width: '100%', height: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
      {loading
        ? <Loading />
        : users.map((user) => <User key={user.id} id={user.id} username={user.username} role={user.role} email={user.email} phone={user.phone} phoneProvider={user.phone_provider} /> )
      }
    </div>
  )

}
export default Users
