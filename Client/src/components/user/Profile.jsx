import React, { useContext, useState } from 'react'
import { AuthContext } from "../../App"
import EditUser from './EditUser'

import profileIcon from '../../../public/images/icons/user.png'
import '../../styles/profile.scss'

const providers = {
        '@txt.att.net': 'AT&T',
        '@pm.sprint.com': 'Sprint',
        '@tmomail.net': 'T-Mobile',
        '@vtext.com': 'Verizon',
        '@myboostmobile.com': 'Boost Mobile',
        '@sms.mycricket.com': 'Cricket',
        '@mymetropcs.com': 'Metro PCS',
        '@mmst5.tracfone.com': 'Tracefone',
        '@email.uscc.net': 'U.S. Cellular',
        '@vmobl.com': 'Virgin Mobile'
    }

const Profile = () => {
  const { state, dispatch } = useContext(AuthContext)
  const [ edit, setEdit ] = useState(false)


  return(
    <div className="profile-wrapper">
      <button className="edit-btn" onClick={() => setEdit(!edit)}>{edit ? 'Cancel' : 'Edit'}</button>
      <div className="profile-pic">
        <img src={profileIcon} alt='User Icon' />
      </div>

      {edit
        ? <EditUser user={state.user} setEdit={() => setEdit(false)} />
        : <div>
            <p>Username: {state.user.username}</p>
            <p>Email: {state.user.email}</p>
            <p>Phone: {state.user.phone}</p>
            <p>Phone Provider: {providers[state.user.phone_provider]}</p>
          </div>
      }

    </div>
  )
}
export default Profile
