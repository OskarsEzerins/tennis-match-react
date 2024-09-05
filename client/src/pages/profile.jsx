import React, { useState, useEffect } from 'react'

import Nav from '../components/Nav'
import ProfileForm from '../components/ProfileForm'
import { useToast } from '../hooks'

import { Switch, FormControlLabel, Container, Grid } from '@material-ui/core'

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    city: '',
    state: '',
    skilllevel: '',
    oppskilllevel: '',
    updateFirstname: null,
    updateLastname: null,
    updateCity: null,
    updateState: null,
    updateSkilllevel: null,
    updateOppskilllevel: null,
    editToggle: false
  })

  const { showToast } = useToast()

  const getProfileInfo = async () => {
    try {
      const res = await fetch('/api/profile')
      const profileInfo = await res.json()
      setProfile((prevProfile) => ({
        ...prevProfile,
        ...profileInfo
      }))
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getProfileInfo()
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }))
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()

    const updateObj = {
      firstname: profile.updateFirstname ?? profile.firstname,
      lastname: profile.updateLastname ?? profile.lastname,
      city: profile.updateCity ?? profile.city,
      state: profile.updateState ?? profile.state,
      skilllevel: profile.updateSkilllevel ?? profile.skilllevel
    }

    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateObj)
      })
      getProfileInfo()
      setProfile((prevProfile) => ({
        ...prevProfile,
        updateFirstname: null,
        updateLastname: null,
        updateCity: null,
        updateState: null,
        editToggle: false
      }))
      showToast('Profile updated!', 'success')
    } catch (err) {
      console.log(err)
    }
  }

  const handleToggle = (event) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      editToggle: event.target.checked
    }))
  }

  return (
    <div>
      <Nav />
      <Container fixed>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <h2>Profile</h2>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={profile.editToggle} onChange={handleToggle} color='primary' />}
              label='Edit Profile'
            />
          </Grid>
          <ProfileForm
            username={profile.username}
            email={profile.email}
            defaultFirst={profile.firstname}
            defaultLast={profile.lastname}
            defaultCity={profile.city}
            defaultState={profile.state}
            defaultSkill={profile.skilllevel}
            updateFirstname={profile.updateFirstname}
            updateLastname={profile.updateLastname}
            updateCity={profile.updateCity}
            updateState={profile.updateState}
            updateSkilllevel={profile.updateSkilllevel}
            updateOppskilllevel={profile.updateOppskilllevel}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
            editToggle={profile.editToggle}
          />
        </Grid>
      </Container>
    </div>
  )
}

export default Profile
