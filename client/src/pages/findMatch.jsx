import React, { useCallback, useEffect, useState } from 'react'

import PlayerAvailabilityCard from '../components/FindMatch/playerAvailabilityCard'
import ProposeForm from '../components/FindMatch/proposeForm'
import ProposeModalForm from '../components/FindMatch/proposeModalForm'
import SearchForm from '../components/FindMatch/searchForm'
import Nav from '../components/Nav'
import { useToast } from '../hooks'
import { CARD_WIDTH, COURT_LIST } from '../utils/constants'
import { DEFAULT_FIELD_DATE_FORMAT } from '../utils/dates'
import { fetchWithErrorHandling, handleXhrError } from '../utils/xhrHelpers'

import { Box, Container, Grid, makeStyles, Paper, Tab, Tabs, Typography } from '@material-ui/core'
import moment from 'moment'
import io from 'socket.io-client'

const socket = io()

const DEFAULT_STATE = {
  eventValue: '',
  searchStartDate: moment(new Date()).format(DEFAULT_FIELD_DATE_FORMAT),
  searchEndDate: moment(new Date()).add(14, 'days').format(DEFAULT_FIELD_DATE_FORMAT),
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
  tabIndex: 0,
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

const useStyles = makeStyles((theme) => ({
  tabRoot: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
    textAlign: 'center'
  },
  tabs: {
    marginBottom: theme.spacing(2)
  },
  tabContent: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius
  }
}))

const FindMatch = () => {
  const [state, setState] = useState(DEFAULT_STATE)
  const { showToast, savePendingToast } = useToast()
  const classes = useStyles()

  const getDate = useCallback(() => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD')
    const selectedDate = localStorage.getItem('selectedDate')

    if (selectedDate > currentDate) {
      setState((prevState) => ({
        ...prevState,
        searchStartDate: selectedDate,
        searchEndDate: selectedDate
      }))
    }

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
      searchArr.length ? 'Players are available! :)' : 'No one is available. :(',
      searchArr.length ? 'success' : 'info'
    )
  }, [])

  const handleSearchMatches = useCallback(
    (_event) => {
      const searchURL = `api/calendar/propose?start_date=${state.searchStartDate}&end_date=${state.searchEndDate}`

      fetchWithErrorHandling(searchURL)
        .then((res) => res.json())
        .then((res) => {
          transformSearchedData(res)
        })
        .catch((error) => handleXhrError({ error, showToast }))
    },
    [state.newDate]
  )

  useEffect(() => {
    getDate()
    handleSearchMatches()
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
        newDate: moment(event.start).format('YYYY-MM-DD'),
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
      const searchURL = `/api/users?username=${newValue}`
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
        type === 'FindMatchByAvailability'
          ? moment(`${newDate} ${startTimeHour}:${startTimeMinute}`, 'YYYY-MM-DD HH:mm').toDate()
          : moment(`${newDate} ${startTime}`, 'YYYY-MM-DD HH:mm').toDate()

      const currentEndDate =
        type === 'FindMatchByAvailability'
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
              showToast(`Oops! ${res.error}`, 'error')
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

  const setSubShow = useCallback(
    (_event, newTabIndex) => {
      if (newTabIndex === 0) {
        getDate()
      }

      setState((prevState) => ({ ...prevState, tabIndex: newTabIndex }))
    },
    [getDate]
  )

  return (
    <div>
      <Nav />
      <Container fixed>
        <Grid container spacing={3} direction='column'>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Typography variant='h2'>Propose Match</Typography>
          </Grid>
          <Grid item>
            <Paper className={classes.tabRoot}>
              <Tabs
                value={state.tabIndex}
                onChange={setSubShow}
                centered
                className={classes.tabs}
                indicatorColor='primary'
                textColor='primary'
              >
                <Tab label='Search By Date' />
                <Tab label='Propose Match to Player' />
              </Tabs>

              {state.tabIndex === 0 && (
                <Box className={classes.tabContent}>
                  <SearchForm
                    handleInputChange={handleInputChange}
                    state={state}
                    handleSearchMatches={handleSearchMatches}
                  />
                </Box>
              )}
              {state.tabIndex === 1 && (
                <Box className={classes.tabContent}>
                  <ProposeForm
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
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item>
            <Grid
              style={{
                display: 'grid',
                'grid-template-columns': `repeat(auto-fill, minmax(${CARD_WIDTH}, 1fr))`,
                gap: '10px'
              }}
            >
              {state.searchResult.map((event, i) => (
                <PlayerAvailabilityCard key={i} event={event} eventIndex={i} handleEventClick={handleEventClick} />
              ))}
            </Grid>
          </Grid>

          {state.clickedResult.map((event) => (
            <ProposeModalForm
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

export default FindMatch
