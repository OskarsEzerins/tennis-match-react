import React, { useState } from 'react'

import SignupForm from '../components/SignupForm'
import { useToast } from '../hooks'

import { Grid, Container } from '@material-ui/core'

const Signup = () => {
  const [signupUsername, setSignupUsername] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupEmail, setSignupEmail] = useState('')

  const {showToast} = useToast()

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
    <div className='login-page'>
      <Container maxWidth='md'>
        <Grid container spacing={3} direction='column' alignItems='center'>
          <Grid item xs={12} sm={8} md={7}>
            <img src={require('../images/tennismatch.png')} width='100%' alt='Tennis Match Logo' />
          </Grid>
          <Grid item xs={12}>
            <SignupForm
              usernameValue={signupUsername}
              passwordValue={signupPassword}
              emailValue={signupEmail}
              handleInputChange={handleInputChange}
              handleFormSubmit={handleFormSubmit}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Signup
