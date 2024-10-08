require('dotenv').config()
const express = require('express')
const session = require('express-session')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const path = require('path')
const fs = require('fs')
const db = require('./server/models')

const PORT = process.env.PORT || 3001

// NOTE: socket io initialization for chat
io.on('connection', (socket) => {
  //user joins a room
  socket.on('joinRoom', ({ username, room, userId }) => {
    const user = { socketId: socket.id, username: username, room: room, userid: userId }

    io.in(parseInt(userId)).emit('output', 'update')
    socket.join(user.room)

    console.log(user.username + ' has joined ' + user.room)

    //updates number of users connected to room when someone joins
    if (io.sockets.adapter.rooms[room]) {
      io.in(user.room).emit('active', io.sockets.adapter.rooms[room].length)
    }

    socket.on('disconnecting', () => {
      // the rooms array contains at least the socket ID
      const rooms = Object.keys(socket.rooms)
    })

    //updates number of users connected to room when someone leaves
    socket.on('disconnect', () => {
      if (io.sockets.adapter.rooms[room]) {
        io.in(user.room).emit('active', io.sockets.adapter.rooms[room].length)
      }
    })
  })

  socket.on('notifyMe', (userid) => {
    const user = { socketId: socket.id, room: userid, userid: userid }
    socket.join(user.room)
  })

  //Receives a new message
  socket.on('input', (data) => {
    const user = { socketId: socket.id, username: data.user, room: data.room, recipientid: data.recipientId }

    //emits new message to specific room
    io.in(user.room).in(user.recipientid).emit('output', data)
  })

  socket.on('newMatchNotification', (userid) => {
    //emits new match update to specific room
    socket.to(userid).emit('output', 'update')
  })

  socket.on('unsubscribe', (room) => {
    socket.leave(room)
  })
})

// NOTE: Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(express.static("public"));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 100 * 365 * 24 * 60 * 60 * 1000
    }
  })
)

const routesPath = path.join(__dirname, 'server', 'routes')
fs.readdirSync(routesPath).forEach(function (file) {
  if (file.endsWith('.js')) {
    const route = require(path.join(routesPath, file))
    app.use('/api', route)
  }
})

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
  })
}

const syncOptions = { force: false }

// NOTE: If running a test, set syncOptions.force to true, clearing the `test db`
if (process.env.NODE_ENV === 'test') {
  syncOptions.force = true
}

// NOTE: add { alter: true } to sync() to update the schema without dropping tables
db.sequelize.sync().then(function () {
  server.listen(PORT, function () {
    console.log('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT)
  })
})

module.exports = app
