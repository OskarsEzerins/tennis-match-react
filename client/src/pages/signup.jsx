import React, { useState } from 'react'

import SignupForm from '../components/SignupForm'
import { useToast } from '../hooks'
import { APP_NAME } from '../utils/constants'

import { Grid, Box, Button, Typography } from '@material-ui/core'

const Signup = () => {
  const [signupUsername, setSignupUsername] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupEmail, setSignupEmail] = useState('')

  const { showToast } = useToast()

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'signupUsername') {
      setSignupUsername(value)
    }
    if (name === 'signupPassword') {
      setSignupPassword(value)
    }
    if (name === 'signupEmail') {
      setSignupEmail(value)
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()

    let signupUser = {
      username: signupUsername,
      password: signupPassword,
      email: signupEmail
    }

    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signupUser)
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.statusString === 'formNotComplete') {
          showToast('Please complete the registration form', 'warning')
        } else if (res.statusString === 'userAlreadyExists') {
          showToast('Account already exists with that username', 'error')
        } else if (res.statusString === 'userCreateSuccess') {
          showToast('Account successfully created', 'success')
          setTimeout(() => {
            window.location.replace('/')
          }, 3000)
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
      <SignupForm
        usernameValue={signupUsername}
        passwordValue={signupPassword}
        emailValue={signupEmail}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
      <Box>
        <div className='subtitle-and-instructions'>
          <p>Already a member?</p>
          <Button variant='contained' href='/'>
            LOG IN
          </Button>
        </div>
      </Box>
    </Grid>
  )
}

export default Signup
