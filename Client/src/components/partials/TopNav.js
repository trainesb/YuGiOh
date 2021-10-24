import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from "../../App"

const TopNav = () => {
  const { state, dispatch } = useContext(AuthContext)

  return (
    <nav className="topnav-wrapper">
      <Link to="/">Home</Link>
      {state.user !== null
        ? <Link to="/logout">Logout</Link>
        : <Link to="/login">Login</Link>
      }
      {state.user !== null && <Link to="/profile">Profile</Link>}
    </nav>
  )
}
export default TopNav
