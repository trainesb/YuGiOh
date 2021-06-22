import React from 'react'

import Cards from './components/cards/Cards'
import Users from './components/user/Users'
import Category from './components/cards/Category'

import About from './components/about/About'
import Profile from './components/user/Profile'
import SingleCard from './components/cards/SingleCard'
import Contact from './components/contact/Contact'
import SetCategories from './components/cards/SetCategories'

const Routes = {
  '/': () => <SetCategories />,
  '/users': () => <Users />,
  '/profile': () => <Profile />,
  '/register': () => <Register />,
  '/contact': () => <Contact />,
  '/about': () => <About />,
  '/category/:id': ({id}) => <Category categoryId={id} />,
  '/card/:id': ({id}) => <SingleCard setMapId={id} />,
  '/set/:id': ({id}) => <Cards setId={id} />
}
export default Routes
