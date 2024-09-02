import React, { useState, useEffect, useCallback } from 'react'

import Nav from '../components/Nav'
import RequestCard from '../components/RequestCard'
import RequestDisplay from '../components/RequestDisplay'
import { DEFAULT_CLOCK_FORMAT } from '../utils/dates'

import { Grid, Container } from '@material-ui/core'
import moment from 'moment'
import io from 'socket.io-client'

const socket = io()

const skillLevels = {
  1: '1.0-1.5 - New Player',
  2: '2.0 - Beginner',
  3: '2.5 - Beginner +',
  4: '3.0 - Beginner-Intermediate',
  5: '3.5 - Intermediate',
  6: '4.0 - Intermediate-Advanced',
  7: '4.5 - Advanced'
}

const Requests = () => {
  const [searchResult, setSearchResult] = useState([])
  const [userid, setUserid] = useState('')

  const convertSkillLevel = useCallback((res) => {
    const searchArr = res.map((item) => ({
      ...item,
      User: {
        ...item.User,
        skilllevel: skillLevels[item.User.skilllevel] || item.User.skilllevel
      }
    }))
    setSearchResult(searchArr)
  }, [])
  const getRequests = useCallback(() => {
    fetch('/api/calendar/requests')
      .then((res) => res.json())
      .then((res) => {
        setUserid(res.userid)
        convertSkillLevel(res.results)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    getRequests()
  }, [])

  const handleConfirm = useCallback(
    (event) => {
      event.preventDefault()
      const { eventId, start, end, eventTitle } = event.currentTarget.dataset
      const titleArr = eventTitle.split('-')
      const updateObj = { id: eventId, title: 'Confirmed -' + titleArr[1] }

      fetch('/api/calendar/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateObj)
      })
        .then(() => {
          const confirmedEventInfo = { id: eventId, start, end }
          return fetch('/api/overlap/destroy', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(confirmedEventInfo)
          })
        })
        .then(() => {
          socket.emit('newMatchNotification', userid)
          getRequests()
        })
        .catch((err) => console.log(err))
    },
    [userid, getRequests]
  )

  const handleDeny = useCallback(
    (event) => {
      event.preventDefault()
      const { eventId } = event.currentTarget.dataset
      const updateObj = { id: eventId }

      fetch('/api/event/deny', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateObj)
      })
        .then(() => {
          socket.emit('newMatchNotification', userid)
          getRequests()
        })
        .catch((err) => console.log(err))
    },
    [userid, getRequests]
  )

  return (
    <div>
      <Nav />
      <Container>
        <Grid container spacing={3} direction='column' alignItems='center'>
          <Grid item xs={12}>
            <RequestDisplay />
          </Grid>
          {searchResult.length !== 0 ? (
            searchResult.map((event, i) => (
              <Grid key={i} item xs={12}>
                <RequestCard
                  key={i}
                  title={event.title}
                  proposeUserid={event.UserId}
                  proposeUsername={event.User.username}
                  proposeUserFirstname={event.User.firstname}
                  proposeUserLastname={event.User.lastname}
                  proposeUserSkill={event.User.skilllevel}
                  eventLocation={event.location}
                  fullStarttime={event.start}
                  fullEndtime={event.end}
                  starttime={moment(event.start).format(DEFAULT_CLOCK_FORMAT)}
                  endtime={moment(event.end).format(DEFAULT_CLOCK_FORMAT)}
                  date={moment(event.start).format('L')}
                  eventId={event.id}
                  handleConfirm={handleConfirm}
                  handleDeny={handleDeny}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <p>You currently have no requests.</p>
            </Grid>
          )}
        </Grid>
      </Container>
    </div>
  )
}

export default Requests
