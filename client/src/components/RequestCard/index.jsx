import React from 'react'

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

const RequestCard = ({
  title,
  proposeUserFirstname,
  proposeUsername,
  proposeUserLastname,
  proposeUserSkill,
  eventLocation,
  date,
  starttime,
  endtime,
  eventId,
  fullStarttime,
  fullEndtime,
  handleConfirm,
  handleDeny
}) => {
  const classes = useStyles()

  return (
    <Card className={classes.root} variant='outlined'>
      <CardContent>
        <Typography variant='h5' gutterBottom>
          {title}
        </Typography>
        <Typography>
          {proposeUserFirstname
            ? `Request by: ${proposeUsername} (${proposeUserFirstname} ${proposeUserLastname})`
            : `Request by: ${proposeUsername}`}
        </Typography>
        <Typography color='textSecondary' gutterBottom>
          Skill level: {proposeUserSkill ? `${proposeUserSkill}` : 'n/a'}
        </Typography>
        <Typography variant='body2' component='p'>
          Court Location: {eventLocation}
          <br />
          Date: {date}
          <br />
          Start Time: {starttime}
          <br />
          End Time: {endtime}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size='small'
          color='primary'
          data-event-id={eventId}
          data-event-title={title}
          data-start={fullStarttime}
          data-end={fullEndtime}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
        <Button size='small' color='secondary' data-event-id={eventId} onClick={handleDeny}>
          Deny
        </Button>
      </CardActions>
    </Card>
  )
}

export default RequestCard
