import React, { useState, useEffect, useCallback } from 'react'

import Nav from '../components/Nav'
import RequestCard from '../components/RequestCard'
import { useToast } from '../hooks'
import { CARD_WIDTH } from '../utils/constants'
import { fetchWithErrorHandling, handleXhrError } from '../utils/xhrHelpers'

import { Grid, Container, Typography } from '@material-ui/core'
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

  const { showToast } = useToast()

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

      fetchWithErrorHandling('/api/calendar/requests', {
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
          showToast('Request confirmed', 'success')
        })
        .catch((error) => handleXhrError(error, showToast))
    },
    [userid, getRequests]
  )

  const handleDeny = useCallback(
    (event) => {
      event.preventDefault()
      const { eventId } = event.currentTarget.dataset
      const updateObj = { id: eventId }

      fetchWithErrorHandling('/api/event/deny', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateObj)
      })
        .then(() => {
          socket.emit('newMatchNotification', userid)
          getRequests()
          showToast('Request denied', 'info')
        })
        .catch((error) => handleXhrError(error, showToast))
    },
    [userid, getRequests]
  )

  return (
    <div>
      <Nav />
      <Container fixed>
        <Grid container spacing={3} direction='column'>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Typography variant='h2'>Requests for Games</Typography>
          </Grid>
          <Grid item xs={12}>
            {searchResult.length !== 0 ? (
              <Grid
                style={{
                  display: 'grid',
                  'grid-template-columns': `repeat(auto-fill, minmax(${CARD_WIDTH}, 1fr))`,
                  gap: '10px'
                }}
              >
                {searchResult.map((event, i) => (
                  <RequestCard key={i} event={event} handleConfirm={handleConfirm} handleDeny={handleDeny} />
                ))}
              </Grid>
            ) : (
              <Grid item xs={12}>
                <p>You currently have no requests.</p>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Requests
