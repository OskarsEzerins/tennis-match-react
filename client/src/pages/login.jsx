import React, { useState } from 'react'

import LoginForm from '../components/LoginForm'
import { useToast } from '../hooks'
import { APP_NAME } from '../utils/constants'

import { Grid, Box, Button, Typography } from '@material-ui/core'

const Login = () => {
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const { showToast } = useToast()

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
          showToast('Must enter Username and Password', 'error')
        } else if (res.statusString === 'wrongPassOrUser') {
          showToast('Incorrect Username and/or Password', 'error')
        } else if (res.statusString === 'loggedin') {
          window.location.href = '/'
        }
      })
      .catch((err) => console.log(err))
  }

  return (
    <Grid
      className='full-page'
      container
      spacing={3}
      direction='column'
      alignItems='center'
      justifyContent='space-evenly'
    >
      <Typography variant='h1'>{APP_NAME}</Typography>
      <LoginForm
        usernameValue={loginUsername}
        passwordValue={loginPassword}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
      <Box>
        <Typography>First time here?</Typography>
        <Button variant='contained' href='/signup'>
          SIGN UP
        </Button>
      </Box>
    </Grid>
  )
}

export default Login
