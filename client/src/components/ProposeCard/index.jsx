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

const ProposeCard = (props) => {
  const classes = useStyles()

  return (
    <Card className={classes.root} variant='outlined'>
      <CardContent>
        <Typography variant='h5' gutterBottom>
          {props.title}
        </Typography>
        <Typography>
          {props.userFirstname
            ? `Username: ${props.username} (${props.userFirstname} ${props.userLastname})`
            : `Username: ${props.username}`}
        </Typography>
        <Typography color='textSecondary' gutterBottom>
          Skill level: {props.userSkill ? `${props.userSkill}` : 'n/a'}
        </Typography>
        <Typography variant='body2' component='p'>
          Court Location: {props.eventLocation}
          <br />
          Start Time: {props.starttime}
          <br />
          End Time: {props.endtime}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size='small'
          color='primary'
          data-userid={props.userid}
          data-location={props.eventLocation}
          onClick={props.handleEventClick}
          data-index={props.eventIndex}
        >
          Propose Match
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProposeCard
