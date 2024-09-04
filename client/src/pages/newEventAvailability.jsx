import React, { useState, useEffect } from 'react'

import Nav from '../components/Nav'
import { NewEventForm } from '../components/NewEventForm'
import { useToast } from '../hooks'
import { COURT_LIST } from '../utils/constants'
import { handleXhrError } from '../utils/xhrHelpers'

import { Grid, Container } from '@material-ui/core'
import moment from 'moment'

const NewEvent = () => {
  const [newDate, setNewDate] = useState('')
  const [startTime, setStartTime] = useState('18:00')
  const [endTime, setEndTime] = useState('19:00')
  const [eventTitle, setEventTitle] = useState('Casual')
  const [eventLocation, setEventLocation] = useState('any')
  const [navValue, _setNavValue] = useState('tab-two')
  const [courtList, _setCourtList] = useState(COURT_LIST)

  const { showToast } = useToast()

  const getDate = () => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD')
    const selectedDate = localStorage.getItem('selectedDate')

    if (selectedDate > currentDate) {
      setNewDate(selectedDate)
    } else {
      setNewDate(currentDate)
    }
    localStorage.removeItem('selectedDate')
  }
  useEffect(() => {
    getDate()
  }, [])

  const handleInputChange = ({ target: { name, value } }) => {
    const stateSetters = {
      eventTitle: setEventTitle,
      eventLocation: setEventLocation,
      startTime: setStartTime,
      endTime: setEndTime,
      newDate: setNewDate
    }

    if (stateSetters[name]) {
      stateSetters[name](value)
    }
  }

  const handleSoftReset = () => {
    setStartTime('17:00')
    setEndTime('18:00')
  }

  const handleReset = () => {
    setNewDate('')
    handleSoftReset()
    setEventTitle('')
    setEventLocation('')
  }

  const parseDate = (dateString, timeString) => {
    const [year, month, day] = dateString.split('-').map(Number)
    const [hour, minute] = timeString.split(':').map(Number)
    return new Date(year, month - 1, day, hour, minute)
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()

    if (!eventTitle || !eventLocation) {
      showToast('Please fill out all fields', 'warning')
      return
    }

    const currentStartDate = parseDate(newDate, startTime)
    const currentEndDate = parseDate(newDate, endTime)

    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: eventTitle,
          start: currentStartDate,
          end: currentEndDate,
          eventStatus: 'available',
          location: eventLocation
        })
      })

      const res = await response.json()

      if (res.statusString === 'error') {
        showToast(`Oops! ${res.error}`, 'error')
      } else {
        handleSoftReset()
        showToast('Your availability has been successfully updated!', 'success')
      }
    } catch (error) {
      handleXhrError({ error, showToast })
    }
  }

  return (
    <div>
      <Nav value={navValue} />
      <Container fixed>
        <Grid container spacing={3}>
          <NewEventForm
            handleInputChange={handleInputChange}
            eventTitle={eventTitle}
            eventLocation={eventLocation}
            newDate={newDate}
            startTime={startTime}
            endTime={endTime}
            handleFormSubmit={handleFormSubmit}
            handleReset={handleReset}
            courtList={courtList}
          />
        </Grid>
      </Container>
    </div>
  )
}

export default NewEvent
