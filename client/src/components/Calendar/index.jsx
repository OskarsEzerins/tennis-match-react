import React from 'react'

import { DEFAULT_CLOCK_FORMAT } from '../../utils/dates'

import FullCalendar from '@fullcalendar/react'

import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

// import { useTheme } from '@material-ui/core'

const CLOCK_FORMAT = {
  hour: '2-digit',
  minute: '2-digit',
  omitZeroMinute: false,
  meridiem: false,
  hour12: false
}

const Calendar = ({ handleDateClick, events, handleEventClick }) => {
  // TODO: fix day names color
  // const theme = useTheme()

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      dateClick={handleDateClick}
      eventClick={handleEventClick}
      initialView='dayGridMonth'
      height='auto'
      events={events}
      timeFormat={DEFAULT_CLOCK_FORMAT}
      slotLabelFormat={CLOCK_FORMAT}
      eventTimeFormat={CLOCK_FORMAT}
      color
      slotMinTime='06:00:00'
      slotMaxTime='23:00:00'
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
    />
  )
}

export default Calendar
