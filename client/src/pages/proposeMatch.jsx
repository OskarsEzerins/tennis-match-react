import React, { useCallback, useEffect, useState } from 'react'

import ProposeMuiModal from '../components/MUIModal'
import Nav from '../components/Nav'
import ProposeCard from '../components/ProposeCard'
import ProposeMatchForm from '../components/ProposeMatchForm'
import ProposeUserSearch from '../components/ProposeUserSearch'
import { useToast } from '../hooks'
import { COURT_LIST } from '../utils/constants'
import { DEFAULT_CLOCK_FORMAT } from '../utils/dates'

import { Button, Container, Grid } from '@material-ui/core'
import moment from 'moment'
import io from 'socket.io-client'

const socket = io()

const DEFAULT_STATE = {
  eventValue: '',
  newDate: '',
  startTime: '17:00',
  endTime: '18:00',
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
  subsectionShow: '',
  courtList: COURT_LIST
}

function transformMatchData(res, formatTime, skillLevels) {
  return res.map((item) => {
    const startHour = parseInt(moment(item.start).format('HH'))
    const endHour = parseInt(moment(item.end).format('HH'))

    const startIntArr = Array.from({ length: endHour - startHour + 1 }, (_, j) => ({
      value: startHour + j,
      display: formatTime(startHour + j)
    }))

    const endIntArr = Array.from({ length: endHour - startHour + 1 }, (_, j) => ({
      value: endHour - j,
      display: formatTime(endHour - j)
    }))

    return {
      ...item,
      User: {
        ...item.User,
        skilllevel: skillLevels[item.User.skilllevel] || item.User.skilllevel
      },
      startIntArr,
      endIntArr
    }
  })
}

const ProposeMatch = () => {
  const [state, setState] = useState(DEFAULT_STATE)
  const toast = useToast()

  const getDate = useCallback(() => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD')
    const selectedDate = localStorage.getItem('selectedDate')

    setState((prevState) => ({
      ...prevState,
      newDate: selectedDate > currentDate ? selectedDate : currentDate
    }))
    localStorage.removeItem('selectedDate')
  }, [])

  useEffect(() => {
    getDate()
  }, [])
  const setModalShow = useCallback((bVal) => {
    setState((prevState) => ({
      ...prevState,
      modalShow: bVal,
      startTimeHour: '',
      startTimeMinute: '',
      endTimeHour: '',
      endTimeMinute: '',
      startTime: '17:00',
      endTime: '18:00',
      eventValue: ''
    }))
  }, [])

  const handleEventClick = useCallback(
    (arg) => {
      const eventIndex = arg.currentTarget.dataset.index
      const eventIndexArr = [state.searchResult[eventIndex]]

      setState((prevState) => ({
        ...prevState,
        modalShow: true,
        clickedResult: eventIndexArr,
        eventLocation: arg.currentTarget.dataset.location,
        eventTitle: eventIndexArr[0].title
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

  const addInputTimes = useCallback((res) => {
    const skillLevels = {
      1: '1.0-1.5 - New Player',
      2: '2.0 - Beginner',
      3: '2.5 - Beginner +',
      4: '3.0 - Beginner-Intermediate',
      5: '3.5 - Intermediate',
      6: '4.0 - Intermediate-Advanced',
      7: '4.5 - Advanced'
    }

    const formatTime = (hour) => moment(`2020-09-18 ${hour}:00:00`).format('h (a)')

    const searchArr = transformMatchData(res, formatTime, skillLevels)

    setState((prevState) => ({ ...prevState, searchResult: searchArr }))
    toast(
      searchArr.length === 0 ? 'No availability on this date.' : 'Availability found!',
      searchArr.length === 0 ? 'info' : 'success'
    )
  }, [])

  const handleFormSubmit = useCallback(
    (event) => {
      event.preventDefault()

      const searchURL = `/api/calendar/propose?date=${state.newDate}`
      fetch(searchURL)
        .then((res) => res.json())
        .then((res) => {
          addInputTimes(res)
        })
        .catch((err) => console.log(err))
    },
    [state.newDate]
  )

  const handleProposeSubmit = useCallback(
    (event) => {
      event.preventDefault()

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
        eventTitle,
        userId
      } = state

      const currentStartDate = startTime
        ? moment(`${newDate} ${startTime}`, 'YYYY-MM-DD HH:mm').toDate()
        : moment(`${newDate} ${startTimeHour}:${startTimeMinute}`, 'YYYY-MM-DD HH:mm').toDate()

      const currentEndDate = endTime
        ? moment(`${newDate} ${endTime}`, 'YYYY-MM-DD HH:mm').toDate()
        : moment(`${newDate} ${endTimeHour}:${endTimeMinute}`, 'YYYY-MM-DD HH:mm').toDate()

      const currentProposeToUserId = event.currentTarget.dataset.userid || userId

      const invalidStates = [
        startTimeHour,
        startTimeMinute,
        endTimeHour,
        endTimeMinute,
        eventLocation,
        confirmedByUser,
        eventTitle
      ]
      const invalidValues = ['Choose...', 'any', '']

      if (invalidStates.some((state) => invalidValues.includes(state))) {
        toast('Please fill out all fields', 'warning')
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

            if (res.statusString === 'eventCreated') {
              toast('Your request for a match has been sent!', 'success')
              window.location.assign('/scheduler')
            } else {
              toast('Oops! Something went wrong. Please try again.', 'error')
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
          handleFormSubmit={handleFormSubmit}
        />
      )
    }
  }, [state, handleNewChange, handleInputChange, handleProposeSubmit, handleUsernameChange, handleFormSubmit])

  const setSubShow = useCallback(
    (event) => {
      setState((_prevState) => ({ ...DEFAULT_STATE, subsectionShow: event.currentTarget.value }))

      if (event.currentTarget.value === 'player') {
        toast("Type in a player's name and fill out the form below.", 'info')
      } else if (event.currentTarget.value === 'date') {
        toast("Pick a date to search for other players' availability.", 'info')
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

          <Grid container spacing={3} direction='column' alignItems='center'>
            {state.searchResult.map((event, i) => (
              <Grid key={i} item xs={12}>
                <ProposeCard
                  key={i}
                  title={event.title}
                  userid={event.UserId}
                  username={event.User.username}
                  userFirstname={event.User.firstname}
                  userLastname={event.User.lastname}
                  userSkill={event.User.skilllevel}
                  eventLocation={event.location}
                  starttime={moment(event.start).format(DEFAULT_CLOCK_FORMAT)}
                  endtime={moment(event.end).format(DEFAULT_CLOCK_FORMAT)}
                  eventIndex={i}
                  handleEventClick={handleEventClick}
                />
              </Grid>
            ))}
          </Grid>

          {state.clickedResult.map((event) => (
            <ProposeMuiModal
              key={event.id}
              show={state.modalShow}
              onHide={() => setModalShow(false)}
              title={event.title}
              userid={event.UserId}
              username={event.User.username}
              userFirstname={event.User.firstname}
              userLastname={event.User.lastname}
              eventLocation={state.eventLocation}
              eventLocationTwo={event.location}
              starttime={moment(event.start).format(DEFAULT_CLOCK_FORMAT)}
              endtime={moment(event.end).format(DEFAULT_CLOCK_FORMAT)}
              startIntArr={event.startIntArr}
              endIntArr={event.endIntArr}
              startTimeHour={state.startTimeHour}
              startTimeMinute={state.startTimeMinute}
              endTimeHour={state.endTimeHour}
              endTimeMinute={state.endTimeMinute}
              handleInputChange={handleInputChange}
              handleProposeSubmit={handleProposeSubmit}
              defaultEventLocation={state.defaultEventLocation}
            />
          ))}
        </Grid>
      </Container>
    </div>
  )
}

export default ProposeMatch
