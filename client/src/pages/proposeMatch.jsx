import React, { useCallback, useEffect, useState } from 'react'

import ProposeMuiModal from '../components/MUIModal'
import Nav from '../components/Nav'
import ProposeCard from '../components/ProposeCard'
import ProposeMatchForm from '../components/ProposeMatchForm'
import ProposeUserSearch from '../components/ProposeUserSearch'
import { useToast } from '../hooks'
import { COURT_LIST } from '../utils/constants'

import { Box, Button, Container, Grid } from '@material-ui/core'
import moment from 'moment'
import io from 'socket.io-client'

const socket = io()

const DEFAULT_STATE = {
  eventValue: '',
  newDate: '',
  startTime: '18:00',
  endTime: '19:00',
  startTimeHour: '',
  startTimeMinute: '',
  endTimeHour: '',
  endTimeMinute: '',
  searchResult: [],
  clickedResult: [],
  userSearch: '',
  userResults: [],
  userId: '',
  eventLocation: '',
  eventTitle: '',
  modalShow: false,
  subsectionShow: 'date',
  courtList: COURT_LIST
}

const SKILL_LEVELS = {
  1: '1.0-1.5 - New Player',
  2: '2.0 - Beginner',
  3: '2.5 - Beginner +',
  4: '3.0 - Beginner-Intermediate',
  5: '3.5 - Intermediate',
  6: '4.0 - Intermediate-Advanced',
  7: '4.5 - Advanced'
}

const ProposeMatch = () => {
  const [state, setState] = useState(DEFAULT_STATE)
  const { showToast, savePendingToast } = useToast()

  const getDate = useCallback(() => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD')
    const selectedDate = localStorage.getItem('selectedDate')

    setState((prevState) => ({
      ...prevState,
      newDate: selectedDate > currentDate ? selectedDate : currentDate
    }))
    localStorage.removeItem('selectedDate')
  }, [])

  const transformSearchedData = useCallback((res) => {
    const searchArr = res.map((item) => ({
      ...item,
      start: moment(item.start),
      end: moment(item.end),
      User: {
        ...item.User,
        skilllevel: SKILL_LEVELS[item.User.skilllevel] || item.User.skilllevel
      }
    }))

    setState((prevState) => ({ ...prevState, searchResult: searchArr }))
    showToast(
      searchArr.length ? 'Availability found!' : 'No availability on this date.',
      searchArr.length ? 'success' : 'info'
    )
  }, [])

  const handleDateFormSubmit = useCallback(
    (event) => {
      event?.preventDefault()

      const searchURL = `/api/calendar/propose?date=${state.newDate}`
      fetch(searchURL)
        .then((res) => res.json())
        .then((res) => {
          transformSearchedData(res)
        })
        .catch((err) => console.log(err))
    },
    [state.newDate]
  )

  useEffect(() => {
    getDate()
    handleDateFormSubmit()
  }, [])

  const setModalShow = useCallback((bVal) => {
    setState((prevState) => ({
      ...prevState,
      modalShow: bVal,
      startTimeHour: '',
      startTimeMinute: '',
      endTimeHour: '',
      endTimeMinute: '',
      startTime: '18:00',
      endTime: '19:00',
      eventValue: ''
    }))
  }, [])

  const handleEventClick = useCallback(
    (arg) => {
      const { index, location } = arg.currentTarget.dataset
      const event = state.searchResult[index]

      setState((prevState) => ({
        ...prevState,
        modalShow: true,
        clickedResult: [event],
        eventLocation: location,
        eventTitle: event.title,
        startTimeHour: moment(event.start).format('HH'),
        startTimeMinute: moment(event.start).format('mm'),
        endTimeHour: moment(event.end).format('HH'),
        endTimeMinute: moment(event.end).format('mm')
      }))
    },
    [state.searchResult]
  )

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }, [])

  const handleNewChange = useCallback((_event, newValue) => {
    setState((prevState) => ({
      ...prevState,
      userSearch: newValue
    }))
  }, [])

  const handleUsernameChange = useCallback(async (_event, newValue) => {
    setState((prevState) => ({ ...prevState, eventValue: newValue }))

    try {
      const searchURL = `/api/username?username=${newValue}`
      const response = await fetch(searchURL)
      const userResults = await response.json()

      const matchedUser = userResults.find((user) => user.username === newValue)

      setState((prevState) => ({
        ...prevState,
        userResults,
        userId: matchedUser ? matchedUser.id : ''
      }))
    } catch (err) {
      console.log(err)
    }
  }, [])

  const handleProposeSubmit = useCallback(
    (type, userId) => {
      const {
        newDate,
        startTime,
        endTime,
        startTimeHour,
        startTimeMinute,
        endTimeHour,
        endTimeMinute,
        eventLocation,
        confirmedByUser,
        eventTitle
      } = state

      const currentStartDate =
        type === 'proposeMatchByAvailability'
          ? moment(`${newDate} ${startTimeHour}:${startTimeMinute}`, 'YYYY-MM-DD HH:mm').toDate()
          : moment(`${newDate} ${startTime}`, 'YYYY-MM-DD HH:mm').toDate()

      const currentEndDate =
        type === 'proposeMatchByAvailability'
          ? moment(`${newDate} ${endTimeHour}:${endTimeMinute}`, 'YYYY-MM-DD HH:mm').toDate()
          : moment(`${newDate} ${endTime}`, 'YYYY-MM-DD HH:mm').toDate()

      const currentProposeToUserId = userId ?? state.userId

      const invalidStates = [eventLocation, confirmedByUser, eventTitle]
      const invalidValues = ['Choose...', 'any', '']

      if (invalidStates.some((state) => invalidValues.includes(state))) {
        showToast('Please fill out all fields', 'warning')
      } else {
        fetch('/api/calendar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: `Proposed - ${eventTitle}`,
            start: currentStartDate,
            end: currentEndDate,
            confirmedByUser: currentProposeToUserId,
            location: eventLocation,
            eventStatus: 'propose'
          })
        })
          .then((res) => res.json())
          .then((res) => {
            socket.emit('newMatchNotification', currentProposeToUserId)

            if (res.statusString === 'error') {
              showToast(`Oops! ${res.error}`, 'error', 'error')
            } else {
              savePendingToast('Your request for a match has been sent!', 'success')
              window.location.assign('/scheduler')
            }
          })
          .catch((err) => console.log(err))
      }
    },
    [state]
  )

  const subsectionRender = useCallback(() => {
    if (state.subsectionShow === 'player') {
      return (
        <ProposeUserSearch
          userSearch={state.userSearch}
          handleNewChange={handleNewChange}
          handleInputChange={handleInputChange}
          handleProposeSubmit={handleProposeSubmit}
          handleUsernameChange={handleUsernameChange}
          userResults={state.userResults}
          newDate={state.newDate}
          startTimeHour={state.startTimeHour}
          startTimeMinute={state.startTimeMinute}
          endTimeHour={state.endTimeHour}
          endTimeMinute={state.endTimeMinute}
          eventLocation={state.eventLocation}
          eventTitle={state.eventTitle}
          startTime={state.startTime}
          endTime={state.endTime}
          eventValue={state.eventValue}
        />
      )
    } else if (state.subsectionShow === 'date') {
      return (
        <ProposeMatchForm
          handleInputChange={handleInputChange}
          newDate={state.newDate}
          handleFormSubmit={handleDateFormSubmit}
        />
      )
    }
  }, [state, handleNewChange, handleInputChange, handleProposeSubmit, handleUsernameChange, handleDateFormSubmit])

  const setSubShow = useCallback(
    (event) => {
      setState((_prevState) => ({ ...DEFAULT_STATE, subsectionShow: event.currentTarget.value }))

      if (event.currentTarget.value === 'date') {
        getDate()
      }
    },
    [getDate]
  )

  return (
    <div>
      <Nav />
      <Container fixed>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <h2>Propose Match</h2>
          </Grid>
          <Grid item xs={12} sm={6} style={{ textAlign: 'center' }}>
            <Button variant='contained' color='primary' value='date' onClick={setSubShow}>
              Search By Date
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} style={{ textAlign: 'center' }}>
            <Button variant='contained' color='primary' value='player' onClick={setSubShow}>
              Propose Match to Player
            </Button>
          </Grid>

          {subsectionRender()}

          <Grid item>
            <Box display='flex' alignItems='center' justifyContent='center' flexWrap='wrap' style={{ gap: '10px' }}>
              {state.searchResult.map((event, i) => (
                <ProposeCard key={i} event={event} eventIndex={i} handleEventClick={handleEventClick} />
              ))}
            </Box>
          </Grid>

          {state.clickedResult.map((event) => (
            <ProposeMuiModal
              key={event.id}
              show={state.modalShow}
              onHide={() => setModalShow(false)}
              handleInputChange={handleInputChange}
              handleProposeSubmit={handleProposeSubmit}
              event={event}
              state={state}
            />
          ))}
        </Grid>
      </Container>
    </div>
  )
}

export default ProposeMatch
