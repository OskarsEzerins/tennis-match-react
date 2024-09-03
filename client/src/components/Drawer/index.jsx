import React, { useState, useEffect, Fragment } from 'react'

import { useToast } from '../../hooks'

import {
  Drawer as MUIDrawer,
  Badge,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  AccountCircle,
  AddCircleOutline,
  AssignmentTurnedIn,
  ChatBubbleOutline,
  Event,
  ExitToApp,
  Public,
  ThumbsUpDown
} from '@material-ui/icons'
import MenuIcon from '@material-ui/icons/Menu'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'
import io from 'socket.io-client'

const socket = io()

const useStyles = makeStyles({
  list: { width: 250 },
  fullList: { width: 'auto' }
})

const Drawer = () => {
  const classes = useStyles()
  const history = useHistory()
  const [state, setState] = useState({ top: false, left: false, bottom: false, right: false })
  const [notificationState, setNotificationState] = useState({
    messages: 0,
    matches: 0,
    notifications: false,
    userid: null
  })

  const { savePendingToast } = useToast()

  useEffect(() => {
    const getNotifications = async () => {
      const res = await fetch('/api/notifications')
      const notifications = await res.json()
      setNotificationState({
        userid: notifications.userid,
        messages: notifications.messages,
        matches: notifications.matches,
        notifications: notifications.messages > 0 || notifications.matches > 0
      })
      socket.emit('notifyMe', notifications.userid)
    }

    const connectToSocket = () => {
      socket.on('output', async () => {
        const res = await fetch('/api/notifications')
        const notifications = await res.json()
        setNotificationState({
          userid: notifications.userid,
          messages: notifications.messages,
          matches: notifications.matches,
          notifications: notifications.messages > 0 || notifications.matches > 0
        })
      })
      return () => socket.disconnect()
    }

    getNotifications()
    connectToSocket()
  }, [])

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setState({ ...state, [anchor]: open })
  }

  const handleLogout = async () => {
    await fetch('/logout')
    savePendingToast('You have been logged out', 'info')
    window.location.href = '/'
  }

  const itemsList = [
    { text: 'Feed', icon: <Public />, onClick: () => history.push('/feed') },
    { text: 'Availability', icon: <AddCircleOutline />, onClick: () => history.push('/availability') },
    { text: 'Scheduler', icon: <Event />, onClick: () => history.push('/scheduler') },
    { text: 'Propose Match', icon: <ThumbsUpDown />, onClick: () => history.push('/proposematch') },
    {
      text: 'Requests',
      icon: (
        <Badge badgeContent={notificationState.matches} color='secondary'>
          <AssignmentTurnedIn />
        </Badge>
      ),
      onClick: () => history.push('/requests')
    },
    {
      text: 'Messenger',
      icon: (
        <Badge badgeContent={notificationState.messages} color='secondary'>
          <ChatBubbleOutline />
        </Badge>
      ),
      onClick: () => history.push('/messenger')
    },
    { text: 'Profile', icon: <AccountCircle />, onClick: () => history.push('/profile') },
    { text: 'Log Out', icon: <ExitToApp />, onClick: handleLogout }
  ]

  const list = (anchor) => (
    <div
      className={clsx(classes.list, { [classes.fullList]: anchor === 'top' || anchor === 'bottom' })}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {itemsList.map(({ text, icon, onClick }) => (
          <ListItem button key={text} onClick={onClick}>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  )

  const anchor = 'left'

  return (
    <div>
      <Fragment key={anchor}>
        <Button onClick={toggleDrawer(anchor, true)}>
          <Badge
            color='primary'
            variant='dot'
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            invisible={!notificationState.notifications}
          >
            <MenuIcon />
          </Badge>
        </Button>
        <MUIDrawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
          {list(anchor)}
        </MUIDrawer>
      </Fragment>
    </div>
  )
}

export default Drawer
