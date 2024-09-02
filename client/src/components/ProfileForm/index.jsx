import React from 'react'

import { TextField, MenuItem, Button, Grid } from '@material-ui/core'

const skills = [
  { value: '1', label: '1.0-1.5 - New Player' },
  { value: '2', label: '2.0 - Beginner' },
  { value: '3', label: '2.5 - Beginner +' },
  { value: '4', label: '3.0 - Beginner-Intermediate' },
  { value: '5', label: '3.5 - Intermediate' },
  { value: '6', label: '4.0 - Intermediate-Advanced' },
  { value: '7', label: '4.5 - Advanced' }
]

const ProfileForm = ({
  username,
  email,
  editToggle,
  updateFirstname,
  defaultFirst,
  updateLastname,
  defaultLast,
  updateCity,
  defaultCity,
  updateSkilllevel,
  defaultSkill,
  handleInputChange,
  handleFormSubmit
}) => {
  return (
    <Grid item xs={12}>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label='Username'
              value={username}
              margin='normal'
              variant='outlined'
              disabled={true}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='Email'
              value={email}
              margin='normal'
              variant='outlined'
              disabled={true}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              disabled={!editToggle}
              label='First Name'
              id='updateFirstname'
              name='updateFirstname'
              value={updateFirstname === null ? defaultFirst : updateFirstname}
              onChange={handleInputChange}
              placeholder={defaultFirst}
              margin='normal'
              variant='outlined'
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              disabled={!editToggle}
              label='Last Name'
              id='updateLastname'
              name='updateLastname'
              value={updateLastname === null ? defaultLast : updateLastname}
              onChange={handleInputChange}
              margin='normal'
              variant='outlined'
              placeholder={defaultLast}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={12} sm={8} md={6}>
            <TextField
              disabled={!editToggle}
              label='City'
              id='updateCity'
              name='updateCity'
              value={updateCity === null ? defaultCity : updateCity}
              onChange={handleInputChange}
              margin='normal'
              variant='outlined'
              placeholder={defaultCity}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              disabled={!editToggle}
              select
              label='Skill Level'
              id='updateSkilllevel'
              name='updateSkilllevel'
              value={updateSkilllevel === null ? defaultSkill : updateSkilllevel}
              onChange={handleInputChange}
              margin='normal'
              variant='outlined'
              placeholder={defaultSkill}
              fullWidth
            >
              {skills.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' color='primary' disabled={!editToggle} onClick={handleFormSubmit}>
              Update
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  )
}

export default ProfileForm
