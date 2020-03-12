import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Menus from './Menu'
import Deploy from './Deploy'
import List from './List'
import axios from 'axios'
import 'antd/dist/antd.css'

axios.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  return Promise.reject(error)
})

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
          <Route exact path='/list' component={List} />
          <Route exact path='/query' />
          <Route exact path='/deploy' component={Deploy} />
          <Redirect from='/' to='/list' />
        </Switch>
      </Router>
    </App>
  )
}
