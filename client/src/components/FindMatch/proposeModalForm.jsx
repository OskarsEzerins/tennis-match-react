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
    {options?.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
)

const CLOCK_OPTIONS = ['00', '15', '30', '45']

const generateEventStartOptions = (moment) =>
  Array.from({ length: 5 }, (_, i) =>
    moment
      .clone()
      .add(i - 2, 'hours')
      .format('HH')
  )

const ProposeModalForm = ({
  show,
  onHide,
  event: {
    title,
    start: eventStart,
    end: eventEnd,
    location: chosenEventLocation,
    User: { id: userId, username, firstname, lastname }
  },

  state: { startTimeHour, startTimeMinute, endTimeHour, endTimeMinute, eventLocation },
  handleProposeSubmit,
  handleInputChange
}) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Dialog open={show} onClose={onHide} fullScreen={fullScreen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Player: {firstname ? `${username} (${firstname} ${lastname})` : `${username}`}
          <br />
          {chosenEventLocation !== 'any' && `Location: ${chosenEventLocation}`}
        </DialogContentText>
        <Grid container spacing={1}>
          {chosenEventLocation === 'any' && (
            <Grid item xs={12}>
              <CustomTextField
                label='Court Location'
                id='eventLocation'
                name='eventLocation'
                value={eventLocation}
                onChange={handleInputChange}
                options={COURT_LIST.filter((court) => court !== 'any')}
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
              options={generateEventStartOptions(eventStart)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label='Start Minute'
              id='startTimeMinute'
              name='startTimeMinute'
              value={startTimeMinute}
              onChange={handleInputChange}
              options={CLOCK_OPTIONS}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label='End Hour'
              id='endTimeHour'
              name='endTimeHour'
              value={endTimeHour}
              onChange={handleInputChange}
              options={generateEventStartOptions(eventEnd)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label='End Minute'
              id='endTimeMinute'
              name='endTimeMinute'
              value={endTimeMinute}
              onChange={handleInputChange}
              options={CLOCK_OPTIONS}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleProposeSubmit('proposeMatchByAvailability', userId)} color='primary'>
          Propose Match
        </Button>
        <Button onClick={onHide} color='secondary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProposeModalForm
