import React, { useEffect, useState } from 'react'
import { useRoutes } from 'hookrouter'
import Routes from './Routes'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Header from './components/partials/Header'
import Footer from './components/partials/Footer'
import TopNav from './components/partials/TopNav'
import Nav from './components/partials/Nav'
import Login from './components/user/Login'
import ProfileIcon from './components/user/ProfileIcon'
import Register from './components/user/register/Register'

export const AuthContext = React.createContext()
const initialState = {
  isAuthenticated: false,
  page: 'login',
  user: null,
}

const reducer = (state, action) => {
  switch(action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      }
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null
      }
    case "SET_PAGE":
      sessionStorage.setItem('Page', action.payload)
      return {
        ...state,
        page: action.payload
      }
    default:
      return state
  }
}


const App = () => {
  const routeResult = useRoutes(Routes)
  const [state, dispatch] = React.useReducer(reducer, initialState)

  useEffect(() => {
    fetch('/api/user/loggedin')
      .then(response => response.json())
      .then(data => {
        if(data.status && sessionStorage.getItem('User')) {

          fetch('/api/user/' + sessionStorage.getItem('User'))
            .then(response => response.json())
            .then(dt => dispatch({type: "LOGIN", payload: dt}))


          let page = sessionStorage.getItem('Page')
          if(page) {
            dispatch({type: "SET_PAGE", payload: page})
          }
        } else if(sessionStorage.getItem('User')) {
          sessionStorage.removeItem('User')
        }
      })
  }, [])

  return (
    <AuthContext.Provider value={{state, dispatch}}>
      <Header />
      <Container fluid style={{ backgroundColor: '#165A97'}}>
        {state.isAuthenticated &&
          <TopNav />
        }
        {!state.isAuthenticated &&
          <Row>
            <Col sm={12} className="justify-content-around" style={{ backgroundColor: '#165A97', display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '0.5em 0.5em 0.5em 0' }}>
              {state.page === 'login' ? <Login /> : <Register />}
            </Col>
          </Row>
        }
        {state.isAuthenticated &&
          <Row>
            <ProfileIcon />
            <Col sm={2} className='p-2 m-0' style={{ backgroundColor: '#165A97', marginTop: '2rem', alignItems: 'center' }}>
              <Nav />
            </Col>
            <Col sm={10} className="justify-content-around" style={{ backgroundColor: '#165A97', display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '0.5em 0.5em 0.5em 0' }}>
              {routeResult}
            </Col>
          </Row>
        }
      </Container>

      <Footer />
    </AuthContext.Provider>
  )
}
export default App
