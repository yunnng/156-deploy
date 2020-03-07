import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import Menus from './Menu'
import './App.css'

const App = styled.div`
  height: 100vh;
`

export default function () {
  return (
    <App className='App'>
      <Router>
        <Menus />
        <Switch>
          <Route exact path='/list' />
          <Route exact path='/query' />
        </Switch>
      </Router>
    </App>
  )
}
