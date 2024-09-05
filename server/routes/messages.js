const express = require('express')
const router = express.Router()
const db = require('../models')
const { Sequelize } = require('../models')

const Op = Sequelize.Op

router.post('/message', function (req, res) {
  if (req.session.loggedin) {
    let requestData = req.body
    requestData.UserId = req.session.userID
    db.Messages.create(requestData)
      .then(function (results) {
        res.json(results)
      })
      .catch((err) => res.send(err))
  } else {
    res.status(400).end()
  }
})

router.get('/messages', function (req, res) {
  if (req.session.loggedin) {
    db.Messages.findAll({
      attributes: ['id', 'message', 'read', 'createdAt', ['UserId', 'senderId'], ['secondUser', 'recipientId']],
      where: {
        [Op.or]: [{ UserId: req.session.userID }, { secondUser: req.session.userID }]
      },
      order: [['createdAt', 'DESC']],
      include: [
        { model: db.User, attributes: ['username', 'firstname', 'lastname', 'pushToken', 'pushEnabled'] },
        {
          model: db.User,
          as: 'recipient',
          attributes: ['username', 'firstname', 'lastname', 'pushToken', 'pushEnabled']
        }
      ]
    })
      .then(function (results) {
        const resArr = { results: results, myUserId: req.session.userID }
        res.json(resArr)
      })
      .catch((err) => console.log(err))
  } else {
    res.sendStatus(404)
  }
})

router.get('/conversation/:recipient', function (req, res) {
  if (req.session.loggedin) {
    db.Messages.findAll({
      attributes: ['id', 'message', 'read', 'createdAt', ['UserId', 'senderId'], ['secondUser', 'recipientId']],
      where: {
        [Op.or]: [
          { userId: req.session.userID, secondUser: req.params.recipient },
          { secondUser: req.session.userID, userId: req.params.recipient }
        ]
      },
      limit: 100,
      order: [['createdAt', 'DESC']],
      include: [
        { model: db.User, attributes: ['username', 'firstname', 'lastname', 'pushToken', 'pushEnabled'] },
        {
          model: db.User,
          as: 'recipient',
          attributes: ['username', 'firstname', 'lastname', 'pushToken', 'pushEnabled']
        }
      ]
    })
      .then(function (results) {
        res.json(results)
      })
      .catch((err) => console.log(err))
  } else {
    res.sendStatus(404)
  }
})

// updates unread messages to read
router.put('/messages/read/:id', function (req, res) {
  if (req.session.loggedin) {
    db.Messages.update(
      {
        read: true
      },
      {
        where: {
          UserId: req.params.id,
          secondUser: req.session.userID,
          read: false
        }
      }
    )
      .then(function (result) {
        console.log('message update result: ' + result)
      })
      .catch((err) => console.log(err))
  } else {
    res.status(400).end()
  }
})

router.get('/notifications', function (req, res) {
  if (req.session.loggedin) {
    const messageNotifications = db.Messages.count({
      where: {
        [Op.and]: [{ secondUser: req.session.userID }, { read: false }]
      }
    }).catch((err) => console.log(err))

    const matchNotifications = db.Event.count({
      where: {
        [Op.and]: [{ confirmedByUser: req.session.userID }, { read: false }, { eventStatus: 'propose' }]
      }
    }).catch((err) => console.log(err))

    Promise.all([messageNotifications, matchNotifications])
      .then((responses) => {
        res.json({ messages: responses[0], matches: responses[1], userid: req.session.userID })
        console.log(`unread notifications for ${req.session.id}: ${responses}`)
      })
      .catch((err) => console.log(err))
  }
})

module.exports = router
