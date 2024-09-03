import React from 'react'

import { DEFAULT_DATE_TIME_FORMAT } from '../../utils/dates'

import { makeStyles, Card, CardActions, CardContent, Button, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      width: 300
    },
    [theme.breakpoints.up('md')]: {
      width: 400
    }
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
}))

const ProposeCard = ({
  event: {
    title,
    User: { id: userid, username, firstname, lastname, skill },
    location: eventLocation,
    start,
    end
  },
  handleEventClick,
  eventIndex
}) => {
  const classes = useStyles()

  return (
    <Card className={classes.root} variant='outlined'>
      <CardContent>
        <Typography variant='h5' gutterBottom>
          {title}
        </Typography>
        <Typography>
          {firstname ? `Username: ${username} (${firstname} ${lastname})` : `Username: ${username}`}
        </Typography>
        <Typography color='textSecondary' gutterBottom>
          Skill level: {skill ? `${skill}` : 'n/a'}
        </Typography>
        <Typography variant='body2' component='p'>
          Court Location: {eventLocation}
          <br />
          Start Time: {start.format(DEFAULT_DATE_TIME_FORMAT)}
          <br />
          End Time: {end.format(DEFAULT_DATE_TIME_FORMAT)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size='small'
          color='primary'
          data-userid={userid}
          data-location={eventLocation}
          onClick={handleEventClick}
          data-index={eventIndex}
        >
          Propose Match
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProposeCard
