import React, { useState, useEffect } from 'react'

import Nav from '../components/Nav'
import { NewEventForm } from '../components/NewEventForm'
import { useToast } from '../hooks'
import { COURT_LIST } from '../utils/constants'

import { Grid, Container } from '@material-ui/core'
import moment from 'moment'

const NewEvent = () => {
  const [newDate, setNewDate] = useState('')
  const [startTime, setStartTime] = useState('18:00')
  const [endTime, setEndTime] = useState('19:00')
  const [eventTitle, setEventTitle] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [navValue, _setNavValue] = useState('tab-two')
  const [courtList, _setCourtList] = useState(COURT_LIST)

  const toast = useToast()

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

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'eventTitle') {
      setEventTitle(value)
    }
    if (name === 'eventLocation') {
      setEventLocation(value)
    }
    if (name === 'startTime') {
      setStartTime(value)
    }
    if (name === 'endTime') {
      setEndTime(value)
    }
    if (name === 'newDate') {
      setNewDate(value)
    }
  }

  const handleReset = () => {
    setNewDate('')
    setStartTime('17:00')
    setEndTime('18:00')
    setEventTitle('')
    setEventLocation('')
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()

    let currentYear = newDate.substring(0, 4)
    let currentMonth = newDate.substring(5, 7)
    let currentMonthAdj = parseInt(currentMonth) - 1
    let currentDay = newDate.substring(8, 10)
    let currentStartHour = startTime.substring(0, 2)
    let currentStartMinute = startTime.substring(3, 5)
    let currentEndHour = endTime.substring(0, 2)
    let currentEndMinute = endTime.substring(3, 5)
    let currentStartDate = new Date(
      parseInt(currentYear),
      currentMonthAdj,
      parseInt(currentDay),
      parseInt(currentStartHour),
      parseInt(currentStartMinute)
    )
    let currentEndDate = new Date(
      parseInt(currentYear),
      currentMonthAdj,
      parseInt(currentDay),
      parseInt(currentEndHour),
      parseInt(currentEndMinute)
    )

    if (eventTitle === '' || eventLocation === '') {
      toast('Please fill out all fields', 'warning')
      return
    }

    fetch('/api/calendar', {
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
      .then((res) => res.json())
      .then((res) => {
        if (res.statusString === 'eventCreated') {
          setNewDate('')
          setStartTime(startTime)
          setEndTime(endTime)
          setEventTitle('')
          setEventLocation('')
          toast('Your availability has been successfully updated!', 'success')
        } else {
          toast('Oops! Something went wrong. Please try again.', 'error')
        }
      })
      .catch((err) => {
        toast('Oops! Something went wrong. Please try again.')
        console.log(err)
      })
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
