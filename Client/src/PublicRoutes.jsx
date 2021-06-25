import React from 'react'

import PublicProfile from './components/publicUser/PublicProfile'
import Login from './components/user/Login'
import Users from './components/user/Users'
import About from './components/about/About'
import Register from './components/user/register/Register'

const PublicRoutes = {
  '/': () => <Users />,
  '/users': () => <Users />,
  '/register': () => <Register />,
  '/about': () => <About />,
  '/login': () => <Login />,
  '/user/:username': ({username}) => <PublicProfile username={username} />,
}
export default PublicRoutes
