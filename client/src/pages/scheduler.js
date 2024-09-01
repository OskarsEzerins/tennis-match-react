import React, { useState, useEffect } from 'react'

import { SchedulerModal, EventDetailsModal } from '../components/Modal'
import Nav from '../components/Nav'
import CalendarEvent from '../utils/CalendarEvent'
import './style.css'

import FullCalendar from '@fullcalendar/react'

import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Container, Box } from '@material-ui/core'
import moment from 'moment'

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
      <Container maxWidth='md'>
        <Box paddingTop='20px'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            dateClick={handleDateClick}
            initialView='dayGridMonth'
            height='auto'
            events={calendarEvents}
            timeFormat='HH:mm'
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              omitZeroMinute: false,
              meridiem: false,
              hour12: false
            }}
            slotMinTime='06:00:00'
            slotMaxTime='23:00:00'
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            eventClick={handleEventClick}
          />
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
          startTime={moment(selectedEvent.start).format('hh:mm a')}
          endTime={moment(selectedEvent.end).format('hh:mm a')}
          location={selectedEvent.location}
          date={moment(selectedEvent.start).format('MM/DD/YYYY')}
          handleDelete={deleteEvent}
        />
      </Container>
    </div>
  )
}

export default Scheduler
