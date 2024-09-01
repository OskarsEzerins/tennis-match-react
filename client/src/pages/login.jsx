import React, { useState } from 'react'

import LoginForm from '../components/LoginForm'

import { Grid, Snackbar, Container } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const Login = () => {
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginInstructions, setLoginInstructions] = useState('Please enter your details')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [severity, setSeverity] = useState('')

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'loginUsername') {
      setLoginUsername(value)
    } else if (name === 'loginPassword') {
      setLoginPassword(value)
    }
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()

    let userCred = {
      username: loginUsername,
      password: loginPassword
    }

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userCred)
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.statusString === 'noPassOrUser') {
          setLoginInstructions('Must enter Username and Password')
          setOpenSnackbar(true)
          setSeverity('error')
        } else if (res.statusString === 'wrongPassOrUser') {
          setLoginInstructions('Incorrect Username and/or Password')
          setOpenSnackbar(true)
          setSeverity('error')
        } else if (res.statusString === 'loggedin') {
          window.location.href = '/'
        }
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className='login-page'>
      <Container maxWidth='md'>
        <Grid container spacing={3} direction='column' alignItems='center'>
          <Grid item xs={12} sm={8} md={7}>
            <img src={require('../images/tennismatch.png')} width='100%' alt='Tennis Match Logo' />
          </Grid>
          <Grid item xs={12}>
            <LoginForm
              usernameValue={loginUsername}
              passwordValue={loginPassword}
              loginInstructions={loginInstructions}
              handleInputChange={handleInputChange}
              handleFormSubmit={handleFormSubmit}
            />
          </Grid>
        </Grid>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={severity}>
          {loginInstructions}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Login
