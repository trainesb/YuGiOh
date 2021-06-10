import React, { useEffect, useState } from 'react'
import { useRoutes } from 'hookrouter'
import Routes from './Routes'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'


export const AuthContext = React.createContext()
const initialState = { page: 'home' }
const reducer = (state, action) => {
  switch(action.type) {
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

  return (
    <AuthContext.Provider value={{state, dispatch}}>
      <Container fluid>
        <Row>
          <Col sm={2} className='p-2 m-0' style={{ backgroundColor: '#165A97', marginTop: '2rem', alignItems: 'center' }}>
            <Nav />
          </Col>
          <Col sm={10} className="justify-content-around" style={{ backgroundColor: '#165A97', display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '0.5em 0.5em 0.5em 0' }}>
            {routeResult}
          </Col>
        </Row>
      </Container>

    </AuthContext.Provider>
  )
}
export default App
