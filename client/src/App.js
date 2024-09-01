import React from 'react'

import Feed from './pages/feed'
import Login from './pages/login'
import Messenger from './pages/messenger'
import Availability from './pages/newEvent'
import Profile from './pages/profile'
import ProposeMatch from './pages/proposeMatch'
import Requests from './pages/requests'
import Scheduler from './pages/scheduler'
import Signup from './pages/signup'
import withAuth from './withAuth'

import { BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      {/* <Jumbotron /> */}
      {/* <Route exact path="/" component={withAuth(Messenger)} /> */}
      <Route exact path='/' component={withAuth(Feed)} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/scheduler' component={withAuth(Scheduler)} />
      <Route exact path='/messenger' component={withAuth(Messenger)} />
      <Route exact path='/feed' component={withAuth(Feed)} />
      <Route exact path='/availability' component={withAuth(Availability)} />
      <Route exact path='/profile' component={withAuth(Profile)} />
      <Route exact path='/proposematch' component={withAuth(ProposeMatch)} />
      <Route exact path='/requests' component={withAuth(Requests)} />
    </Router>
  )
}

export default App
