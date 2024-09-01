import React, { Component } from 'react'

import { SchedulerModal, EventDetailsModal } from '../components/Modal'
import Nav from '../components/Nav'
import CalendarEvent from '../utils/CalendarEvent'
import './style.css'
import './style.css'

import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Container, Box } from '@material-ui/core'

class Scheduler extends Component {
  state = {
    savedDates: [],
    selectedEvent: {},
    selectedFirstUser: {},
    selectedSecondUser: {},
    dateModalShow: false,
    eventModalShow: false,
    thisDate: '',
    navValue: 'tab-three',
    calendarEvents: []
  }

  componentDidMount() {
    this.getDates()
  }

  getDates = () => {
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

        this.setState({ savedDates: calendarEvents, calendarEvents: tempArr })
      })
      .catch((err) => console.log(err))
  }

  setModalShow = (mName, bVal) => {
    this.setState({ [mName]: bVal })
  }

  handleDateClick = (arg) => {
    this.setState({ dateModalShow: true, thisDate: arg.dateStr })

    const selectedDate = moment(arg.dateStr).format('YYYY-MM-DD')
    localStorage.setItem('selectedDate', selectedDate)
  }

  handleEventClick = (arg) => {
    this.setState({ eventModalShow: true, thisDate: arg.dateStr })
    let selectedEventArr = {}

    this.state.savedDates.forEach((date) => {
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

    this.setState(selectedEventArr)
  }

  deleteEvent = () => {
    console.log('clicked on delete')
    fetch('api/event/delete/' + this.state.selectedEvent.id, {
      method: 'DELETE'
    })
      .then((res) => {
        this.getDates()
      })
      .catch((err) => {
        console.log(err)
      })
    this.setState({ eventModalShow: false })
  }

  render() {
    return (
      <div>
        <Nav value={this.state.navValue} />
        <Container maxWidth='md'>
          <Box paddingTop='20px'>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              dateClick={this.handleDateClick}
              initialView='dayGridMonth'
              height='auto'
              events={this.state.calendarEvents}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              eventClick={this.handleEventClick}
            />
          </Box>
          <SchedulerModal
            show={this.state.dateModalShow}
            onHide={() => this.setModalShow('dateModalShow', false)}
            thisDate={moment(this.state.thisDate).format('MMM DD YYYY')}
          />
          <EventDetailsModal
            show={this.state.eventModalShow}
            onHide={() => this.setModalShow('eventModalShow', false)}
            eventName={this.state.selectedEvent.title}
            playerOneUsername={this.state.selectedFirstUser.username}
            playerOneFirst={this.state.selectedFirstUser.firstname}
            playerOneLast={this.state.selectedFirstUser.lastname}
            playerTwoUsername={this.state.selectedSecondUser.username}
            playerTwoFirst={this.state.selectedSecondUser.firstname}
            playerTwoLast={this.state.selectedSecondUser.lastname}
            startTime={moment(this.state.selectedEvent.start).format('hh:mm a')}
            endTime={moment(this.state.selectedEvent.end).format('hh:mm a')}
            location={this.state.selectedEvent.location}
            date={moment(this.state.selectedEvent.start).format('MM/DD/YYYY')}
            handleDelete={this.deleteEvent}
          />
        </Container>
      </div>
    )
  }
}

export default Scheduler
