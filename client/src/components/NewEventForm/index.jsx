import React from 'react'

import { useToast } from '../../hooks'

import { TextField, Button, Grid, MenuItem, Box } from '@material-ui/core'

export const NewEventForm = ({
  courtList,
  eventLocation,
  eventTitle,
  handleInputChange,
  handleFormSubmit,
  handleReset,
  newDate,
  endTime,
  startTime
}) => {
  const toast = useToast()

  return (
    <Grid item xs={12}>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <h2>Availability</h2>
        <div>
          <p>{}</p>
        </div>
      </Grid>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label='Play Type'
              id='eventTitle'
              name='eventTitle'
              value={eventTitle}
              onChange={handleInputChange}
              margin='normal'
              variant='outlined'
              placeholder='Play Type'
              fullWidth
            >
              <MenuItem value='Casual'>Casual</MenuItem>
              <MenuItem value='Competitive'>Competitive</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label='Court Location'
              id='eventLocation'
              name='eventLocation'
              value={eventLocation}
              onChange={handleInputChange}
              margin='normal'
              variant='outlined'
              placeholder='Court Location'
              fullWidth
            >
              {courtList.map((event, i) => (
                <MenuItem key={i} value={event}>
                  {event}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='Date'
              id='newDate'
              name='newDate'
              type='date'
              value={newDate}
              onChange={handleInputChange}
              margin='normal'
              variant='outlined'
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              id='startTime'
              name='startTime'
              label='Start Time'
              type='time'
              value={startTime}
              onChange={handleInputChange}
              margin='normal'
              variant='outlined'
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                step: 300 // NOTE: 5 min
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              id='endTime'
              name='endTime'
              label='End Time'
              type='time'
              value={endTime}
              onChange={handleInputChange}
              margin='normal'
              variant='outlined'
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                step: 300 // NOTE: 5 min
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Box display='flex' justifyContent='space-between' style={{ gap: '10px' }}>
                <Button variant='contained' color='primary' onClick={handleFormSubmit} mr={2}>
                  Submit
                </Button>
                <Button variant='contained' color='default' onClick={() => window.location.assign('/scheduler')}>
                  Go to scheduler
                </Button>
              </Box>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => {
                  handleReset()
                  toast('Form reset', 'warning')
                }}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Grid>
  )
}
