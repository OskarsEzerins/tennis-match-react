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

const LoginForm = ({ handleFormSubmit, handleInputChange, usernameValue, passwordValue }) => {
  const classes = useStyles()

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <div className='subtitle-and-instructions'>
          <h2>Login</h2>
        </div>

        <Box display='flex' justifyContent='center' alignItems='center'>
          <TextField
            id='loginUsername'
            name='loginUsername'
            label='Username'
            autoComplete='username'
            InputProps={{ classes: classes }}
            onChange={handleInputChange}
            value={usernameValue}
          />
        </Box>

        <Box display='flex' justifyContent='center' alignItems='center'>
          <TextField
            type='password'
            id='loginPassword'
            name='loginPassword'
            label='Password'
            autoComplete='current-password'
            InputProps={{ classes: classes }}
            onChange={handleInputChange}
            value={passwordValue}
          />
        </Box>

        <Box display='flex' justifyContent='center' alignItems='center' paddingTop='20px'>
          <Button type='submit' variant='contained' color='primary' onClick={handleFormSubmit}>
            Sign In
          </Button>
        </Box>
      </Form>
    </>
  )
}

export default LoginForm
