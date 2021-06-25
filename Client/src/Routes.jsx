import React from 'react'

import Cards from './components/cards/Cards'
import Users from './components/user/Users'
import Category from './components/cards/Category'

import About from './components/about/About'
import Profile from './components/user/Profile'
import SearchedCard from './components/cards/SearchedCard'
import SingleCard from './components/cards/SingleCard'
import Contact from './components/contact/Contact'
import SetCategories from './components/cards/SetCategories'
import PublicProfile from './components/publicUser/PublicProfile'

const Routes = {
  '/': () => <SetCategories />,
  '/users': () => <Users />,
  '/profile': () => <Profile />,
  '/contact': () => <Contact />,
  '/about': () => <About />,
  '/category/:id': ({id}) => <Category categoryId={id} />,
  '/card/:id': ({id}) => <SingleCard setMapId={id} />,
  '/searched/card/:id': ({id}) => <SearchedCard cardId={id} />,
  '/set/:id': ({id}) => <Cards setId={id} />,
  '/user/:username': ({username}) => <PublicProfile username={username} />,
}
export default Routes
