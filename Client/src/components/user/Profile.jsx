import React, { useContext } from 'react'

import { AuthContext } from "../../App"
import User from './User'

const Profile = () => {
  const { state, dispatch } = useContext(AuthContext)

  return(
    <div style={{backgroundColor: '#C5D7E8', width: '100%', height: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
      <User key={state.user.id} id={state.user.id} username={state.user.username} role={state.user.role} email={state.user.email} phone={state.user.phone} phoneProvider={state.user.phone_provider} />
    </div>
  )
}
export default Profile
