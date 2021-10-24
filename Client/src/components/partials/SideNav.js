import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { getCategories } from '../../services/CategoriesService'

const SideNav = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategories().then(data => setCategories(data))
  }, [])

  return (
    <nav className="sideNav-wrapper">
      {categories.length > 0 &&
        <ul>
          {categories.map((category) => <li key={category.id}><Link to={'/category/' + category.category_name.replace(/\s+/g, '-')}>{category.category_name}</Link></li>)}
        </ul>
      }
    </nav>
  )
}
export default SideNav
