import React, { useState, useEffect } from 'react'

import Calendar from '../components/Calendar'
import { SchedulerModal, EventDetailsModal } from '../components/Modal'
import Nav from '../components/Nav'
import CalendarEvent from '../utils/CalendarEvent'
import { DEFAULT_CLOCK_FORMAT, DEFAULT_DATE_FORMAT } from '../utils/dates'
import './style.css'

import { Container, Box, Typography } from '@material-ui/core'
import { teal, green } from '@material-ui/core/colors'
import InfoIcon from '@material-ui/icons/Info'
import moment from 'moment'

const MatchStatusIndicator = ({ color, label }) => (
  <Box display='flex' alignItems='center'>
    <Box width='10px' height='10px' bgcolor={color} marginRight='8px' borderRadius='10px' />
    <Typography variant='subtitle1'>{`- ${label}`}</Typography>
  </Box>
)

const Scheduler = () => {
  const [savedDates, setSavedDates] = useState([])
  const [selectedEvent, setSelectedEvent] = useState({})
  const [selectedFirstUser, setSelectedFirstUser] = useState({})
  const [selectedSecondUser, setSelectedSecondUser] = useState({})
  const [dateModalShow, setDateModalShow] = useState(false)
  const [eventModalShow, setEventModalShow] = useState(false)
  const [thisDate, setThisDate] = useState('')
  const [navValue, _setNavValue] = useState('tab-three')
  const [calendarEvents, setCalendarEvents] = useState([])

  const getDates = () => {
    fetch('/api/calendar')
      .then((res) => res.json())
      .then((dates) => {
        const calendarEvents = dates.results

        calendarEvents.forEach((date) => {
          if (moment(new Date()).format('YYYYMMDD') > moment(date.end).format('YYYYMMDD')) {
            date.eventStatus = 'expired'
          }
        })

        calendarEvents.map((date) => {
          switch (date.eventStatus) {
            case 'available':
              date.color = '#3c70f2'
              break
            case 'confirmed':
              date.color = '#00ff2a'
              break
            case 'proposed':
              date.color = '#f7f704'
              break
            case 'denied':
              date.color = '#f73838'
              break
            case 'expired':
              date.color = '#e0e0e0'
              break
          }
        })
        let tempArr = []

        calendarEvents.forEach((date) => {
          tempArr.push(new CalendarEvent(date.id, date.title, date.start, date.color))
        })

        setSavedDates(calendarEvents)
        setCalendarEvents(tempArr)
      })
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    getDates()
  }, [])

  const handleDateClick = (arg) => {
    setDateModalShow(true)
    setThisDate(arg.dateStr)

    const selectedDate = moment(arg.dateStr).format('YYYY-MM-DD')
    localStorage.setItem('selectedDate', selectedDate)
  }

  const handleEventClick = (arg) => {
    setEventModalShow(true)
    setThisDate(arg.dateStr)
    let selectedEventArr = {}

    savedDates.forEach((date) => {
      if (date.id == arg.event._def.publicId && date.secondUser) {
        selectedEventArr = { selectedEvent: date, selectedFirstUser: date.User, selectedSecondUser: date.secondUser }
      } else if (date.id == arg.event._def.publicId) {
        selectedEventArr = {
          selectedEvent: date,
          selectedFirstUser: date.User,
          selectedSecondUser: { username: 'none', firstname: '', lastname: '' }
        }
      }
    })

    setSelectedEvent(selectedEventArr.selectedEvent)
    setSelectedFirstUser(selectedEventArr.selectedFirstUser)
    setSelectedSecondUser(selectedEventArr.selectedSecondUser)
  }

  const deleteEvent = () => {
    console.log('clicked on delete')
    fetch('api/event/delete/' + selectedEvent.id, {
      method: 'DELETE'
    })
      .then((_res) => {
        getDates()
      })
      .catch((err) => {
        console.log(err)
      })
    setEventModalShow(false)
  }

  return (
    <div>
      <Nav value={navValue} />
      <Container>
        <Box marginTop='20px'>
          <Calendar handleDateClick={handleDateClick} events={calendarEvents} handleEventClick={handleEventClick} />
        </Box>
        <Box
          margin='20px'
          padding='20px'
          bgcolor={teal[50]}
          border={`1px solid ${green[500]}`}
          borderRadius='8px'
          display='flex'
          alignItems='left'
          flexDirection='column'
        >
          <Box display='flex' alignItems='center'>
            <InfoIcon style={{ marginRight: '8px' }} />
            <Typography variant='subtitle1'>Click on a time slot to create or find a match.</Typography>
          </Box>
          <MatchStatusIndicator color='red' label='Denied match' />
          <MatchStatusIndicator color='blue' label='Proposed match / Marked availability' />
          <MatchStatusIndicator color='green' label='Confirmed match' />
        </Box>
        <SchedulerModal
          show={dateModalShow}
          onHide={() => setDateModalShow(false)}
          thisDate={moment(thisDate).format('MMM DD YYYY')}
        />
        <EventDetailsModal
          show={eventModalShow}
          onHide={() => setEventModalShow(false)}
          eventName={selectedEvent.title}
          playerOneUsername={selectedFirstUser.username}
          playerOneFirst={selectedFirstUser.firstname}
          playerOneLast={selectedFirstUser.lastname}
          playerTwoUsername={selectedSecondUser.username}
          playerTwoFirst={selectedSecondUser.firstname}
          playerTwoLast={selectedSecondUser.lastname}
          startTime={moment(selectedEvent.start).format(DEFAULT_CLOCK_FORMAT)}
          endTime={moment(selectedEvent.end).format(DEFAULT_CLOCK_FORMAT)}
          location={selectedEvent.location}
          date={moment(selectedEvent.start).format(DEFAULT_DATE_FORMAT)}
          handleDelete={deleteEvent}
        />
      </Container>
    </div>
  )
}

export default Scheduler
