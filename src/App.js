import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Menus from './pages/Menu'
import Deploy from './pages/Deploy'
import List from './pages/List'
import './App.css'

const App = styled.div`
  height: 100vh;
  display: flex;
`

export default function () {
  return (
    <App className='App'>
      <Router>
        <Menus />
        <Switch>
          <Route exact path='/list' >
            <List />
          </Route>
          <Route exact path='/deploy' component={Deploy} />
          <Route exact path='/query' />
          <Redirect from='/' to='/list' />
        </Switch>
      </Router>
    </App>
  )
}
