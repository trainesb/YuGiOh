import React, { useState, useRef, useEffect } from 'react'

import userIcon from '../../../public/images/icons/user.png'
import '../../styles/profileIcon.scss'

const ProfileIcon = () => {
  const ref = useRef()
  const [show, setShow] = useState(false)

  useEffect(() => {
    document.addEventListener("mouseover", handleClick)

    return () => {
      document.removeEventListener("mouseover", handleClick)
    }
  }, [])

  const handleClick = (e) => {
    if (ref.current.contains(e.target)) {
      // inside click
      setShow(true)
      return
    }

    //outside click
    setShow(false)
  }

  const handleLogout = (event) => {
    event.preventDefault()

    fetch('/api/user/logout')
      .then(() => {
        sessionStorage.removeItem('User')
      })
      .then(() => window.location.assign('/'))
  }


  return (
    <div className="profile-icon-wrapper" ref={ref}>
      <a href='/profile'><img className="profile-icon" src={userIcon} /></a>

      {show &&
        <div className="profile-menu">
          <div className="profile-menu-link">
            <a href='/profile'>Profile</a>
          </div>

          <div className="profile-menu-link">
            <a onClick={handleLogout}>Logout</a>
          </div>
        </div>
      }
    </div>
  )
}
export default ProfileIcon
