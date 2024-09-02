import React, { useState } from 'react'

import LoginForm from '../components/LoginForm'
import { useToast } from '../hooks'

import { Grid, Container } from '@material-ui/core'

const Login = () => {
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const toast = useToast()

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'loginUsername') {
      setLoginUsername(value)
    } else if (name === 'loginPassword') {
      setLoginPassword(value)
    }
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
          toast('Must enter Username and Password', 'error')
        } else if (res.statusString === 'wrongPassOrUser') {
          toast('Incorrect Username and/or Password', 'error')
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
              handleInputChange={handleInputChange}
              handleFormSubmit={handleFormSubmit}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Login
