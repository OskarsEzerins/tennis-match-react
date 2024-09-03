import React from 'react'

import { useToast } from '../../hooks'
import { APP_NAME } from '../../utils/constants'
import Drawer from '../Drawer'

import { Grid, useMediaQuery, AppBar, Typography, Button, Toolbar, ButtonGroup } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { AccountCircle, AssignmentTurnedIn, ChatBubbleOutline, ExitToApp, ThumbsUpDown } from '@material-ui/icons'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import EventIcon from '@material-ui/icons/Event'
import Public from '@material-ui/icons/Public'
import clsx from 'clsx'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'

const ButtonContent = ({ icon: Icon, label }) => {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <Icon />
      <span>{label}</span>
    </span>
  )
}

// TODO: DRY with Drawer
const Nav = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const location = useLocation()
  const currentPath = location.pathname

  const { savePendingToast } = useToast()

  const isActive = (path) => currentPath === path

  const buttons = [
    { path: '/feed', icon: Public, label: 'Feed' },
    { path: '/availability', icon: AddCircleOutlineIcon, label: 'Availability' },
    { path: '/scheduler', icon: EventIcon, label: 'Scheduler' },
    { path: '/proposematch', icon: ThumbsUpDown, label: 'Propose Match' },
    { path: '/requests', icon: AssignmentTurnedIn, label: 'Requests' }
  ]

  const rightButtons = [
    { path: '/messenger', icon: ChatBubbleOutline, label: 'Messenger' },
    { path: '/profile', icon: AccountCircle, label: 'Profile' }
  ]

  const handleLogout = async () => {
    await fetch('/logout')
    savePendingToast('You have been logged out', 'info')
    window.location.href = '/'
  }

  return (
    <AppBar position='sticky' color='default'>
      <div className='upper-nav row'>
        <Grid container alignItems='center' justifyContent='space-between'>
          {isMobile && (
            <Grid item>
              <Drawer />
            </Grid>
          )}
          <Grid item xs>
            <Grid container justifyContent='center'>
              <Typography variant='h2'>{APP_NAME}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>

      {!isMobile && (
        <Toolbar>
          <Grid container alignItems='center' justifyContent='space-between'>
            <Grid item>
              <ButtonGroup variant='text'>
                {buttons.map(({ path, icon, label }) => (
                  <Button key={path} href={path} color={clsx({ primary: isActive(path) })}>
                    <ButtonContent icon={icon} label={label} />
                  </Button>
                ))}
              </ButtonGroup>
            </Grid>
            <Grid item>
              <ButtonGroup variant='text'>
                {rightButtons.map(({ path, icon, label }) => (
                  <Button key={path} href={path}>
                    <ButtonContent icon={icon} label={label} />
                  </Button>
                ))}
                <Button onClick={handleLogout}>
                  <ButtonContent icon={ExitToApp} label='Log Out' />
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Toolbar>
      )}
    </AppBar>
  )
}

export default Nav
