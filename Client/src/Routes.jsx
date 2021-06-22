import React from 'react'

import Cards from './components/Cards'
import Users from './components/user/Users'
import Category from './components/Category'

import About from './components/about/About'
import Profile from './components/user/Profile'
import SingleCard from './components/SingleCard'
import Contact from './components/contact/Contact'
import SetCategories from './components/SetCategories'

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
