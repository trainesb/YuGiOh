import React from 'react'

import Cards from './components/Cards'
import Category from './components/Category'
import Profile from './components/user/Profile'
import SingleCard from './components/SingleCard'
import SetCategories from './components/SetCategories'

const Routes = {
  '/': () => <SetCategories />,
  '/profile': () => <Profile />,
  '/category/:id': ({id}) => <Category categoryId={id} />,
  '/card/:id': ({id}) => <SingleCard setMapId={id} />,
  '/set/:id': ({id}) => <Cards setId={id} />
}
export default Routes
