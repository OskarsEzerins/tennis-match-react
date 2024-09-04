import React from 'react'

import { CARD_WIDTH, CARD_WIDTH_SM } from '../../utils/constants'
import { DEFAULT_CLOCK_FORMAT } from '../../utils/dates'

import { makeStyles, Card, CardActions, CardContent, Button, Typography, Avatar, Grid } from '@material-ui/core'

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

const PlayerAvailabilityCard = ({
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

  const firstAndLastName = `${firstname} ${lastname}`

  return (
    <Card className={classes.root} variant='outlined'>
      <CardContent className={classes.content}>
        <Grid container spacing={2} alignItems='center' justifyContent='center'>
          <Grid item>
            <Avatar className={classes.avatar}>{username.charAt(0)}</Avatar>
          </Grid>
          <Grid item xs>
            <Typography className={classes.title}>{firstAndLastName ? firstAndLastName : username}</Typography>
            <Typography className={classes.subtitle}>Skill level: {skill ? `${skill}` : 'n/a'}</Typography>
          </Grid>
        </Grid>
        <div className={classes.highlight}>
          <Typography variant='body1' component='p' className={classes.subtitle}>
            {start.format(DEFAULT_CLOCK_FORMAT)} - {end.format(DEFAULT_CLOCK_FORMAT)}, {start.format('dddd, D. MMM')}
          </Typography>
        </div>
        <Typography variant='body2' component='p' className={classes.subtitle}>
          Court: {eventLocation}
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

export default PlayerAvailabilityCard
