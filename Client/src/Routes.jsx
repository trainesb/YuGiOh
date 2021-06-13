import React from 'react'

import SetCategories from './components/SetCategories'
import Category from './components/Category'
import SingleCard from './components/SingleCard'
import Cards from './components/Cards'

const Routes = {
  '/': () => <SetCategories />,
  '/category/:id': ({id}) => <Category categoryId={id} />,
  '/card/:id': ({id}) => <SingleCard setMapId={id} />,
  '/set/:id': ({id}) => <Cards setId={id} />
}
export default Routes
