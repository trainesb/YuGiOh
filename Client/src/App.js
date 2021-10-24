import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'

import TopNav from './components/partials/TopNav'
import SideNav from './components/partials/SideNav'
import Register from './components/user/Register'
import Profile from './components/user/Profile'
import Login from './components/user/Login'
import Validate from './components/user/Validate'
import ValidateCode from './components/user/ValidateCode'
import Category from './components/category/Category'
import Set from './components/set/Set'

export const AuthContext = React.createContext()
const initialState = {
  isAuthenticated: false,
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
    default:
      return state
  }
}

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  useEffect(() => {
    fetch('/api/loggedin')
      .then(response => response.json())
      .then(data => {
          if(data.status && sessionStorage.getItem('User')) {
            fetch('/api/user/' + sessionStorage.getItem('User'))
            .then(response => response.json())
            .then(dt => dispatch({type: "LOGIN", payload: dt}))
          } else if(sessionStorage.getItem('User')) {
            sessionStorage.removeItem('User')
          }
      })
  }, [])

  return(
    <AuthContext.Provider value={{state, dispatch}}>
      <TopNav />
      <div className="body-wrapper">
        <SideNav />
        <div className="wrapper">
          <Switch>
            <Route exact path='/login' component={Login} />
            {state.user === null && <Route exact path='/register' component={Register} />}
            {state.user !== null && <Route exact path='/profile' component={Profile} />}
            <Route exact path='/category/:cat' component={Category} />
            <Route exact path='/set/:setCode' component={Set} />
            <Route exact path="/validate/:username" component={Validate} />
            <Route exact path="/validate/:username/:code" component={ValidateCode} />


            <Route exact path='/'>
              <h1>Home</h1>

              {state.user !== null &&
                <p>User: {state.user.username}</p>
              }
            </Route>
          </Switch>
        </div>
      </div>
    </AuthContext.Provider>
  )
}

export default App
