import React, { useState } from 'react'

import { APP_NAME } from '../../utils/constants'
import Drawer from '../Drawer'
import './style.css'

import { Grid, useMediaQuery, AppBar, Typography } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import EventIcon from '@material-ui/icons/Event'
import Public from '@material-ui/icons/Public'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
}))

const DynamicLabel = ({ icon: Icon, label }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return !isMobile ? (
    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Icon />
      <span>{label}</span>
    </span>
  ) : (
    <Icon />
  )
}

const Nav = (props) => {
  const classes = useStyles()
  const [value, setValue] = useState(props.value)

  const handleChange = (event, _newValue) => {
    setValue(event.target.value)
  }

  return (
    <AppBar position='sticky'>
      <div className='upper-nav row'>
        <Grid container alignItems='center' justifyContent='space-between'>
          <Grid item>
            <Drawer />
          </Grid>
          <Grid item xs>
            <Grid container justifyContent='center'>
              <Typography variant='h1'>{APP_NAME}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <div>
        <Paper square className={classes.root}>
          <Tabs value={value} onChange={handleChange} variant='fullWidth' indicatorColor='primary' textColor='primary'>
            <Tab href='/feed' label={<DynamicLabel icon={Public} label='Feed' />} value='tab-one' />
            <Tab
              href='/availability'
              label={<DynamicLabel icon={AddCircleOutlineIcon} label='Availability' />}
              value='tab-two'
            />
            <Tab href='/scheduler' label={<DynamicLabel icon={EventIcon} label='Scheduler' />} value='tab-three' />
          </Tabs>
        </Paper>
      </div>
    </AppBar>
  )
}

export default Nav
