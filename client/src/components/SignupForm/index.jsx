import React from 'react'

import Form from '../Form'
import './style.css'

import { makeStyles, TextField, Button, Box } from '@material-ui/core'

const useStyles = makeStyles((_theme) => ({
  input: {
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px rgb(144,238,80) inset'
    }
  }
}))

const SignupForm = ({ handleInputChange, handleFormSubmit, usernameValue, emailValue, passwordValue }) => {
  const classes = useStyles()

  return (
    <div>
      <div className='subtitle-and-instructions'>
        <h2>Create Account</h2>
      </div>

      <Form onSubmit={handleFormSubmit}>
        <Box display='flex' justifyContent='center' alignItems='center'>
          <TextField
            id='signupUsername'
            name='signupUsername'
            label='Username'
            InputProps={{ classes: classes }}
            onChange={handleInputChange}
            value={usernameValue}
          />
        </Box>

        <Box display='flex' justifyContent='center' alignItems='center'>
          <TextField
            id='signupEmail'
            name='signupEmail'
            label='Email'
            InputProps={{ classes: classes }}
            onChange={handleInputChange}
            value={emailValue}
          />
        </Box>

        <Box display='flex' justifyContent='center' alignItems='center'>
          <TextField
            type='password'
            id='signupPassword'
            name='signupPassword'
            label='Password'
            InputProps={{ classes: classes }}
            onChange={handleInputChange}
            value={passwordValue}
          />
        </Box>

        <Box display='flex' justifyContent='center' alignItems='center' paddingTop='15px'>
          <Button type='submit' variant='contained' color='primary' onClick={handleFormSubmit}>
            Create Account
          </Button>
        </Box>
      </Form>
    </div>
  )
}

export default SignupForm
