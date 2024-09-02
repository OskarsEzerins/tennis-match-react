import React from 'react'

import { COURT_LIST } from '../../utils/constants'

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Grid,
  useMediaQuery,
  useTheme
} from '@material-ui/core'

const CustomTextField = ({ label, id, name, value, onChange, options }) => (
  <TextField
    select
    label={label}
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    margin='normal'
    variant='outlined'
    fullWidth
  >
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.value}
      </MenuItem>
    ))}
  </TextField>
)

const ProposeMuiModal = ({
  show,
  onHide,
  title,
  username,
  userFirstname,
  userLastname,
  eventLocationTwo,
  eventLocation,
  defaultEventLocation,
  handleInputChange,
  startTimeHour,
  startIntArr,
  startTimeMinute,
  endTimeHour,
  endIntArr,
  endTimeMinute,
  handleProposeSubmit,
  userid
}) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Dialog open={show} onClose={onHide} fullScreen={fullScreen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {userFirstname ? `Username: ${username} (${userFirstname} ${userLastname})` : `Username: ${username}`}
          <br />
          {eventLocationTwo !== 'any' && `Location: ${eventLocationTwo}`}
        </DialogContentText>
        <Grid container spacing={1}>
          {eventLocationTwo === 'any' && (
            <Grid item xs={12}>
              <CustomTextField
                label='Court Location'
                id='eventLocation'
                name='eventLocation'
                value={eventLocation === 'any' ? defaultEventLocation : eventLocation}
                onChange={handleInputChange}
                options={COURT_LIST.map((court) => ({ value: court, display: court }))}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label='Start Hour'
              id='startTimeHour'
              name='startTimeHour'
              value={startTimeHour}
              onChange={handleInputChange}
              options={startIntArr.map((hour) => ({ value: hour.value, display: hour.display }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label='Start Minute'
              id='startTimeMinute'
              name='startTimeMinute'
              value={startTimeMinute}
              onChange={handleInputChange}
              options={[
                { value: '00', display: ':00' },
                { value: '15', display: ':15' },
                { value: '30', display: ':30' },
                { value: '45', display: ':45' }
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label='End Hour'
              id='endTimeHour'
              name='endTimeHour'
              value={endTimeHour}
              onChange={handleInputChange}
              options={endIntArr.map((hour) => ({ value: hour.value, display: hour.display }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label='End Minute'
              id='endTimeMinute'
              name='endTimeMinute'
              value={endTimeMinute}
              onChange={handleInputChange}
              options={[
                { value: '00', display: ':00' },
                { value: '15', display: ':15' },
                { value: '30', display: ':30' },
                { value: '45', display: ':45' }
              ]}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button data-userid={userid} onClick={handleProposeSubmit} color='primary'>
          Propose Match
        </Button>
        <Button onClick={onHide} color='secondary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProposeMuiModal
