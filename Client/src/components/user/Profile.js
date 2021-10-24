import React, { useState, useContext } from 'react'
import { AuthContext } from "../../App"
import EditUser from './EditUser'

const Profile = () => {
  const { state } = useContext(AuthContext)
  const [showEdit, setShowEdit] = useState(false)

  return(
    <div className="profile-wrapper">
      {state.user !== null &&
        <>
          <div className="profile-title-wrapper">
            <h2 className="profile-title">{state.user.username}'s Profile</h2>
            <p className="profile-edit-btn" onClick={() => setShowEdit(true)}><img src="/images/edit.png" alt="Edit" /></p>
          </div>
          <hr />
          <ul>
            <li>Username: { state.user.username }</li>
            <li>Phone: { state.user.phone }</li>
            <li>Email: { state.user.email }</li>
          </ul>

          <EditUser show={showEdit} onHide={() => setShowEdit(false)} username={state.user.username} phone={state.user.phone} email={state.user.email} id={state.user.id} phoneProvider={state.user.phone_provider} />
        </>
      }
    </div>
  )
}

export default Profile
