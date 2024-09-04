import React from 'react'

import { CARD_WIDTH, CARD_WIDTH_SM } from '../../utils/constants'
import { DEFAULT_CLOCK_FORMAT } from '../../utils/dates'

import { makeStyles, Card, CardActions, CardContent, Button, Typography, Avatar, Grid } from '@material-ui/core'
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      minWidth: CARD_WIDTH_SM
    },
    [theme.breakpoints.up('md')]: {
      width: CARD_WIDTH
    },
    margin: 'auto',
    borderRadius: 15,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  content: {
    padding: theme.spacing(2),
    paddingBottom: 0,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 15,
    color: theme.palette.text.secondary
  },
  highlight: {
    backgroundColor: theme.palette.action.hover,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  }
}))

const RequestCard = ({ event: { id: eventId, title, User, location, start, end }, handleConfirm, handleDeny }) => {
  const classes = useStyles()

  const {
    firstname: proposerFirstName,
    lastname: proposerLastname,
    username: proposerUsername,
    skilllevel: proposerSkillLevel
  } = User

  const firstAndLastName = `${proposerFirstName} ${proposerLastname}`
  const startMoment = moment(start)
  const endMoment = moment(end)

  return (
    <Card className={classes.root} variant='outlined'>
      <CardContent className={classes.content}>
        <Grid container spacing={2} alignItems='center' justifyContent='center'>
          <Grid item>
            <Avatar className={classes.avatar}>{proposerUsername.charAt(0)}</Avatar>
          </Grid>
          <Grid item xs>
            <Typography className={classes.title}>{firstAndLastName ? firstAndLastName : proposerUsername}</Typography>
            <Typography className={classes.subtitle}>
              Skill level: {proposerSkillLevel ? `${proposerSkillLevel}` : 'n/a'}
            </Typography>
          </Grid>
        </Grid>
        <div className={classes.highlight}>
          <Typography variant='body1' component='p' className={classes.subtitle}>
            {startMoment.format(DEFAULT_CLOCK_FORMAT)} - {endMoment.format(DEFAULT_CLOCK_FORMAT)},{' '}
            {startMoment.format('dddd, D. MMM')}
          </Typography>
        </div>
        <Typography variant='body2' component='p' className={classes.subtitle}>
          Court: {location}
          <br />
          Type: {title.toLowerCase()}
          <br />
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size='large'
          color='primary'
          variant='outlined'
          className={classes.button}
          fullWidth
          data-event-id={eventId}
          data-event-title={title}
          data-start={start}
          data-end={end}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
        <Button
          size='large'
          color='secondary'
          variant='outlined'
          className={classes.button}
          fullWidth
          data-event-id={eventId}
          onClick={handleDeny}
        >
          Deny
        </Button>
      </CardActions>
    </Card>
  )
}

export default RequestCard
