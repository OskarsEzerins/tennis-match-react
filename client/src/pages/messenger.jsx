import React, { useState, useEffect } from 'react'

import BottomNav from '../components/BottomNav'
import Nav from '../components/Nav'
import { DEFAULT_CLOCK_FORMAT } from '../utils/dates'
import './style.css'

import {
  TextField,
  Icon,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Paper,
  Box,
  withStyles
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import moment from 'moment'
import io from 'socket.io-client'

const socket = io()

const useStyles = {
  listItemThem: {
    backgroundColor: '#E2FB70'
  },
  unreadMessage: {
    backgroundColor: '#E2FB70'
  },
  readMessage: {
    color: 'grey'
  },
  underline: {
    '&:before': {
      borderBottomColor: 'white'
    },
    '&:after': {
      borderBottomColor: 'white'
    },
    '&:hover:before': {
      borderBottomColor: ['white', '!important']
    }
  }
}

const Messenger = ({ classes }) => {
  const [sendMessage, setSendMessage] = useState('')
  const [allMessages, setAllMessages] = useState([])
  const [showMessages, setShowMessages] = useState([])
  const [conversations, setConversations] = useState([])
  const [user, setUser] = useState({})
  const [sendTo, setSendTo] = useState({})
  const [room, setRoom] = useState('')
  const [users, setUsers] = useState([])
  const [rooms, setRooms] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [navValue, _setNavValue] = useState('')
  const [userId, setUserId] = useState('')
  const [subsectionShow, setSubsectionShow] = useState('inbox')
  const [bottomNavValue, setBottomNavValue] = useState('inbox-tab')

  const getProfileInfo = () => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((profileInfo) => {
        setUser({ username: profileInfo.username, userid: profileInfo.id })
      })
      .catch((err) => console.log(err))

    fetch('/api/messages')
      .then((res) => res.json())
      .then((res) => {
        const messages = res.results
        const newConversations = messages.filter(
          (message, index, self) =>
            index === self.findIndex((m) => m.senderId === message.senderId && m.recipientId === message.recipientId)
        )
        setAllMessages(messages)
        setConversations(newConversations)
      })
      .catch((err) => console.log(err))
  }
  const setInboxPage = () => {
    setSubsectionShow('inbox')
    setBottomNavValue('inbox-tab')
    getProfileInfo()
  }

  const setChatPage = () => {
    setSubsectionShow('chat')
    setBottomNavValue('chat-tab')
  }
  const connectToSocket = () => {
    socket.on('output', (data) => {
      data.createdAt = new Date()
      const newAllMessages = [data, ...allMessages]
      const newConversations = newAllMessages.filter(
        (message, index, self) =>
          index === self.findIndex((m) => m.senderId === message.senderId && m.recipientId === message.recipientId)
      )
      setAllMessages(newAllMessages)
      setShowMessages(
        newAllMessages.filter((message) => message.recipientId === sendTo.id || message.senderId === sendTo.id)
      )
      setConversations(newConversations)
    })

    socket.on('active', (data) => {
      setSendTo((prevSendTo) => ({ ...prevSendTo, active: data === 2 }))
    })
  }

  // TODO:
  const handleUserSearch = (event) => {
    fetch('api/username?username=' + event.target.value)
      .then((res) => res.json())
      .then((users) => {
        setUsers(users)
        console.log('user info: ' + users)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    connectToSocket()
    getProfileInfo()
    return () => {
      socket.emit('unsubscribe', room)
    }
  }, [room])

  const createRoom = (x, y) => (x > y ? x + '+' + y : y + '+' + x)

  const handleInputChange = (event, _newValue) => {
    if (event.type === 'click') {
      const userId = user.userid
      const username = user.username
      const recipientUsername = event.target.parentElement.dataset.username
      const recipientId = event.target.parentElement.dataset.id
      const room = createRoom(recipientId, userId)
      setChatPage()

      fetch('/api/messages/read/' + recipientId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err))

      if (!rooms.includes(room)) {
        socket.emit('joinRoom', { username, room, userId })
        setRooms([...rooms, room])
      }

      setSendTo({ id: parseInt(recipientId), username: recipientUsername, active: false })
      setRoom(room)
      setShowMessages(
        allMessages.filter((message) => message.recipientId === recipientId || message.senderId === recipientId)
      )
      setUserSearch('')
      setUsers([])
    } else {
      setSendMessage(event.target.value)
    }
  }

  const pushSendMessage = (event) => {
    if ((event.keyCode === 13 && !event.shiftKey) || event.type === 'click') {
      event.preventDefault()

      socket.emit('input', {
        User: { username: user.username },
        message: sendMessage,
        room,
        senderId: user.userid,
        recipientId: sendTo.id,
        recipient: sendTo
      })

      fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: sendMessage,
          secondUser: sendTo.id,
          read: sendTo.active
        })
      })
        .then((res) => console.log('Your message was sent!'))
        .catch((err) => console.log(err))

      setSendMessage('')
    }
  }

  const handleUsernameChange = (event, newValue) => {
    setUserSearch(newValue)
    fetch('/api/username?username=' + newValue)
      .then((res) => res.json())
      .then((res) => {
        setUsers(res)
        const currentUser = res.find((user) => user.username === newValue)
        if (currentUser) {
          setUserId(currentUser.id)
        }
      })
      .catch((err) => console.log(err))
  }

  const handleNewChange = (event, newValue) => {
    if (newValue.id !== sendTo.id) {
      const room = createRoom(newValue.id, user.userid)
      const username = user.username
      setChatPage()

      fetch('/api/messages/read/' + newValue.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err))

      setSendTo({
        firstname: newValue.firstname,
        lastname: newValue.lastname,
        username: newValue.username,
        id: newValue.id,
        active: false
      })
      setRoom(room)
      setShowMessages(
        allMessages.filter((message) => message.recipientId === newValue.id || message.senderId === newValue.id)
      )
      socket.emit('joinRoom', { username, room })
      setUserSearch('')
      setUsers([])
    }
  }

  const subsectionRender = () => {
    if (subsectionShow === 'inbox') {
      return (
        <div>
          <Box paddingBottom='30px'>
            <Grid container justify='center'>
              <Grid xs={12} sm={4}>
                <Box display='flex' justifyContent='center'>
                  <h2>Inbox</h2>
                </Box>
              </Grid>
              <Grid xs={12} sm={4}>
                {room === 3 && (userId === 3 ? 'test' : 'test123')}
                <Autocomplete
                  id='userSearch'
                  freesolo
                  autoSelect
                  name='userSearch'
                  value={sendTo}
                  onChange={handleNewChange}
                  inputValue={userSearch}
                  onInputChange={handleUsernameChange}
                  options={users}
                  getOptionLabel={(option) => option.username}
                  renderOption={(option) =>
                    option.firstname ? (
                      <span>
                        {option.username} ({option.firstname} {option.lastname})
                      </span>
                    ) : (
                      <span>{option.username}</span>
                    )
                  }
                  renderInput={(params) => (
                    <TextField {...params} label='User Search' margin='normal' variant='outlined'></TextField>
                  )}
                />
              </Grid>
              <Grid xs={0} sm={4}></Grid>
            </Grid>
            <Grid container justify='space-evenly'>
              <Grid xs={11} sm={9} item={true}>
                <List>
                  {conversations.map((conversation) => (
                    <Paper key={conversation.id}>
                      <ListItem
                        onClick={handleInputChange}
                        className={
                          conversation.senderId !== user.userid && !conversation.read
                            ? classes.unreadMessage
                            : classes.readMessage
                        }
                        button
                      >
                        <ListItemText
                          primary={
                            conversation.User.username === user.username
                              ? conversation.recipient.username
                              : conversation.User.username
                          }
                          secondary={conversation.message}
                          data-id={
                            conversation.senderId === user.userid ? conversation.recipientId : conversation.senderId
                          }
                          data-username={
                            conversation.User.username === user.username
                              ? conversation.recipient.username
                              : conversation.User.username
                          }
                        />
                      </ListItem>
                      <Divider component='li' />
                    </Paper>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Box>
        </div>
      )
    } else if (subsectionShow === 'chat') {
      return (
        <div>
          <Box>
            <Grid container justify='center'>
              <Grid container className='chat-banner' alignItems='center'>
                <Grid item xs={12} sm={4} style={{ textAlign: 'center', color: 'white' }}>
                  <h2>{sendTo.username}</h2>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <div className='send-message-wrapper'>
                    <div className='send-message'>
                      <TextField
                        InputProps={{ classes: { underline: classes.underline } }}
                        id='standard-basic'
                        placeholder='Send message...'
                        multiline
                        className='message-field'
                        onChange={handleInputChange}
                        value={sendMessage}
                        onKeyDown={pushSendMessage}
                      />
                      <Button endIcon={<Icon>send</Icon>} onClick={pushSendMessage}></Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item sm={1}></Grid>
                <Grid item xs={12} sm={10}>
                  <List>
                    {showMessages.map((message, idx) => (
                      <Paper key={idx}>
                        <ListItem button className={message.senderId === user.userid ? '' : classes.listItemThem}>
                          <ListItemText
                            primary={`${message.senderId === user.userid ? 'Me' : message.User.username}: ${message.message}`}
                            secondary={
                              moment(message.createdAt).format('MMDDYYYY') === moment(new Date()).format('MMDDYYYY')
                                ? `Today ${moment(message.createdAt).format(DEFAULT_CLOCK_FORMAT)}`
                                : moment(message.createdAt).format('M/DD/YY')
                            }
                          />
                        </ListItem>
                        <Divider component='li' />
                      </Paper>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </div>
      )
    }
  }

  return (
    <div>
      <Nav update={navValue} />
      {subsectionRender()}
      <BottomNav
        value={bottomNavValue}
        setInboxPage={setInboxPage}
        setChatPage={setChatPage}
        sendTo={sendTo.username}
      />
    </div>
  )
}

export default withStyles(useStyles)(Messenger)
