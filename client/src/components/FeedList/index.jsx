import React from 'react'

import { DEFAULT_CLOCK_FORMAT, DEFAULT_DATE_FORMAT } from '../../utils/dates'

import {
  Button,
  Paper,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar,
  Avatar,
  Divider,
  Container
} from '@material-ui/core'
import moment from 'moment'

const DEFAULT_THUMBNAIL = 'https://www.iconfinder.com/data/icons/tennis-player-1/265/tennis-player-005-512.png'

// For entire feed of FeedItem components
export function FeedList({ children }) {
  return (
    <Container fixed>
      <List>{children}</List>
    </Container>
  )
}

// NOTE: For each event just scheduled or just completed
export const FeedListItem = ({
  // TODO: later replace with hybrid image of both participating players
  thumbnail = DEFAULT_THUMBNAIL,
  organizer,
  confirmer,
  matchStart
}) => {
  const matchStartMoment = moment(matchStart)

  const matchStartDay = matchStartMoment.format('dddd')
  const matchStartDate = matchStartMoment.format(DEFAULT_DATE_FORMAT)
  const matchStartClock = matchStartMoment.format(DEFAULT_CLOCK_FORMAT)

  return (
    <Paper>
      <ListItem alignItems='flex-start'>
        <ListItemAvatar>
          <Avatar alt={organizer} src={thumbnail} />
        </ListItemAvatar>
        <ListItemText
          primary={`${organizer} scheduled a match with ${confirmer} on ${matchStartDay}, ${matchStartDate} at ${matchStartClock}`}
        />
        <ListItemAvatar>
          <Avatar alt={confirmer} src={thumbnail} />
        </ListItemAvatar>
      </ListItem>
      <Divider component='li' />
    </Paper>
  )
}

export function FeedListItemDeny({
  //later replace with hybrid image of both participating players
  thumbnail = 'https://placehold.it/300x300',
  title,
  okayDeny,
  eventID,
  confirmer,
  matchStart
}) {
  const matchStartMoment = moment(matchStart)

  const matchStartDay = matchStartMoment.format('dddd')
  const matchStartDate = matchStartMoment.format(DEFAULT_DATE_FORMAT)
  const matchStartClock = matchStartMoment.format(DEFAULT_CLOCK_FORMAT)

  return (
    <Paper>
      <ListItem alignItems='flex-start'>
        <ListItemAvatar>
          <Avatar alt={confirmer} src={thumbnail} />
        </ListItemAvatar>
        <ListItemText primary={`${title}. Proposed for ${matchStartDay}, ${matchStartDate} at ${matchStartClock}`} />
        <Button onClick={okayDeny} data-id={eventID}>
          Ok
        </Button>
      </ListItem>
      <Divider variant='inset' component='li' />
    </Paper>
  )
}
