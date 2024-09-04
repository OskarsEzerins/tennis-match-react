import React, { useMemo } from 'react'

import { ToastProvider } from './hooks'
import Feed from './pages/feed'
import FindMatch from './pages/findMatch'
import Login from './pages/login'
import Messenger from './pages/messenger'
import Availability from './pages/newEventAvailability'
import Profile from './pages/profile'
import Requests from './pages/requests'
import Scheduler from './pages/scheduler'
import Signup from './pages/signup'
import { TennisTheme } from './theme'
import withAuth from './withAuth'

import { CssBaseline, useMediaQuery } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/core/styles'
import { BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(() => TennisTheme(prefersDarkMode), [prefersDarkMode])

  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <CssBaseline />
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
          <Route exact path='/find_match' component={withAuth(FindMatch)} />
          <Route exact path='/requests' component={withAuth(Requests)} />
        </Router>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
