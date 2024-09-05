const express = require('express')
const router = express.Router()
const db = require('../models')
const { Sequelize } = require('../models')
const moment = require('moment')

const Op = Sequelize.Op

router.get('/calendar', function (req, res) {
  if (req.session.loggedin) {
    db.Event.findAll({
      where: {
        [Op.or]: [
          { UserId: req.session.userID },
          {
            eventStatus: 'confirmed',
            confirmedByUser: req.session.userID
          }
        ]
      },
      order: [['start']],
      include: [
        {
          model: db.User,
          attributes: ['username', 'firstname', 'lastname', 'id']
        },
        {
          model: db.User,
          as: 'secondUser',
          attributes: ['username', 'firstname', 'lastname', 'id']
        }
      ]
    }).then(function (results) {
      res.json({ results: results, myUserId: req.session.userID })
    })
  } else {
    res.status(400).end()
  }
})

router.post('/calendar', function (req, res) {
  if (req.session.loggedin) {
    let requestData = req.body
    requestData.UserId = req.session.userID
    db.Event.create(requestData)
      .then(function (results) {
        res.send({
          statusString: 'eventCreated',
          results
        })
      })
      .catch((err) => {
        console.error('Error creating event:', err)
        res.status(500).send({
          statusString: 'error',
          message: 'Failed to create event',
          error: err.message
        })
      })
  } else {
    res.status(400).send({
      statusString: 'error',
      message: 'User not logged in'
    })
  }
})

// confirmed events for feed
router.get('/confirmed', function (req, res) {
  if (req.session.loggedin) {
    db.Event.findAll({
      where: {
        eventStatus: 'confirmed'
      },
      include: [
        { model: db.User },
        {
          model: db.User,
          as: 'secondUser'
        }
      ],
      order: [['createdAt', 'DESC']]
    }).then(function (results) {
      res.json(results)
    })
  } else {
    res.status(400).end()
  }
})

// user's proposed match updates
router.get('/updates', function (req, res) {
  if (req.session.loggedin) {
    db.Event.findAll({
      where: {
        eventStatus: 'denied',
        UserId: req.session.userID
      },
      include: [
        { model: db.User },
        {
          model: db.User,
          as: 'secondUser'
        }
      ],
      order: [['createdAt', 'DESC']]
    }).then(function (results) {
      res.json(results)
    })
  } else {
    res.status(400).end()
  }
})

router.get('/calendar/propose', function (req, res) {
  const { start_date: startDate, end_date: endDate, location, skill, user } = req.query

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate query parameters are required' }).end()
  }

  const startOfDay = moment(startDate).startOf('day').toDate()
  const endOfDay = moment(endDate).endOf('day').toDate()
  const dateSearch = { start: { [Op.between]: [startOfDay, endOfDay] } }

  const locationSearch = location ? { location } : {}
  const skillUserSearch = {
    ...(skill && { skilllevel: skill }),
    ...(user && { id: user })
  }

  if (req.session.loggedin) {
    db.Event.findAll({
      where: {
        [Op.and]: [
          dateSearch,
          locationSearch,
          { UserId: { [Op.not]: req.session.userID } },
          { eventStatus: 'available' }
        ]
      },
      include: [
        {
          model: db.User,
          attributes: ['username', 'firstname', 'lastname', 'id', 'skilllevel', 'pushToken', 'pushEnabled'],
          where: skillUserSearch
        }
      ],
      order: [['start', 'ASC']]
    }).then((results) => res.json(results))
  } else {
    res.status(400).end()
  }
})

// Get logged in user's requests
router.get('/calendar/requests', function (req, res) {
  if (req.session.loggedin) {
    db.Event.findAll({
      where: {
        [Op.and]: [{ confirmedByUser: req.session.userID }, { eventStatus: 'propose' }]
      },
      include: [
        {
          model: db.User,
          attributes: ['username', 'firstname', 'lastname', 'id', 'skilllevel', 'pushToken', 'pushEnabled']
        }
      ]
    }).then(function (results) {
      results = { results: results, userid: req.session.userID }
      res.json(results)
    })
  } else {
    res.status(400).end()
  }
})

router.put('/calendar/requests', function (req, res) {
  if (req.session.loggedin) {
    db.Event.update(
      {
        title: req.body.title,
        eventStatus: 'confirmed'
      },
      {
        where: {
          id: req.body.id
        }
      }
    ).then(function (result) {
      res.send(result)
    })
  } else {
    res.status(400).end()
  }
})

router.delete('/overlap/destroy', function (req, res) {
  if (req.session.loggedin) {
    db.Event.destroy({
      where: {
        UserId: req.session.userID,
        eventStatus: 'available',
        [Op.or]: [
          {
            start: {
              [Op.gte]: req.body.start,
              [Op.lte]: req.body.end
            }
          },
          {
            start: {
              [Op.lte]: req.body.start
            },
            end: {
              [Op.gte]: req.body.start
            }
          }
        ]
      }
    }).then(function (result) {
      res.json(result)
    })
  } else {
    res.status(400).end()
  }
})

router.put('/event/deny', function (req, res) {
  if (req.session.loggedin) {
    db.Event.update(
      {
        eventStatus: 'denied',
        title: 'Denied by ' + req.session.username
      },
      {
        where: {
          id: req.body.id
        }
      }
    ).then(function (result) {
      res.send(result)
    })
  } else {
    res.status(400).end()
  }
})

router.delete('/event/delete/:id', function (req, res) {
  db.Event.destroy({ where: { id: req.params.id } }).then(function (event) {
    res.json(event)
  })
})

module.exports = router
