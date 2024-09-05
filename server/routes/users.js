const express = require('express')
const router = express.Router()
const db = require('../models')
const { Sequelize } = require('../models')

const Op = Sequelize.Op

router.get('/profile', function (req, res) {
  if (req.session.loggedin) {
    db.User.findOne({
      where: {
        id: req.session.userID
      }
    })
      .then(function (results) {
        res.json(results)
      })
      .catch((err) => console.log(err))
  } else {
    res.sendStatus(404)
  }
})

router.put('/profile', function (req, res) {
  if (req.session.loggedin) {
    console.log(req.body)
    db.User.update(req.body, {
      where: {
        id: req.session.userID
      }
    })
      .then(function (result) {
        res.sendStatus(200)
      })
      .catch((err) => res.send(err))
  } else {
    res.status(400).end()
  }
})

// search for usernames
router.get('/users', function (req, res) {
  if (req.session.loggedin) {
    if (req.query.username === '') {
      return res.status(400).json({ error: 'username is required' }).end()
    }

    if (req.query.username.split(' ').length > 1) {
      let userArr = req.query.username.split(' ')

      db.User.findAll({
        attributes: ['username', 'firstname', 'lastname', 'id', 'pushToken', 'pushEnabled'],
        where: {
          [Op.and]: [
            { firstname: { [Op.substring]: userArr[0] } },
            { lastname: { [Op.substring]: userArr[1] } },
            { id: { [Op.not]: req.session.userID } }
          ]
        }
      }).then(function (results) {
        res.json(results)
      })
    } else {
      db.User.findAll({
        attributes: ['username', 'firstname', 'lastname', 'id', 'pushToken', 'pushEnabled'],
        where: {
          id: { [Op.not]: req.session.userID },
          [Op.or]: [
            { username: { [Op.substring]: req.query.username } },
            { firstname: { [Op.substring]: req.query.username } },
            { lastname: { [Op.substring]: req.query.username } }
          ]
        }
      }).then(function (results) {
        res.json(results)
      })
    }
  } else {
    res.status(400).end()
  }
})

module.exports = router
