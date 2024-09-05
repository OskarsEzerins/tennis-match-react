const express = require('express')
const router = express.Router()
const db = require('../models')
const crypto = require('crypto')

router.post('/login', function (req, res) {
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
    const hashed_password = crypto.createHash('sha256').update(req.body.password).digest('hex')
    db.User.findAll({
      where: {
        username: username,
        password: hashed_password
      }
    }).then(function (results) {
      console.log(results)
      if (results.length > 0) {
        console.log('YOU ARE LOGGED IN')
        req.session.loggedin = true
        req.session.userID = results[0].id
        req.session.username = results[0].username
        // res.redirect("/loggedin");
        res.send({
          statusString: 'loggedin'
        })
      } else {
        console.log('WRONG PASS OR USER')
        res.send({
          statusString: 'wrongPassOrUser'
        })
      }
    })
  } else {
    res.send({
      statusString: 'noPassOrUser'
    })
  }
})

router.get('/validate_user_login', function (req, res) {
  if (req.session.loggedin) {
    res.sendStatus(200)
  } else {
    res.sendStatus(404)
  }
})

router.post('/sign_up', function (req, res) {
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email

  if (username && password && email) {
    const accountGetObj = {
      username: username
    }

    db.User.findAll({ where: accountGetObj }).then(function (results) {
      // console.log("this works: " + results.length);
      if (results.length === 0) {
        const hashed_password = crypto.createHash('sha256').update(req.body.password).digest('hex')
        const postObj = {
          username: username,
          password: hashed_password,
          email: email
        }
        db.User.create(postObj).then(function (_results2) {
          res.send({
            statusString: 'userCreateSuccess'
          })
        })
      } else {
        res.send({
          statusString: 'userAlreadyExists'
        })
      }
    })
  } else {
    res.send({
      statusString: 'formNotComplete'
    })
  }
})

router.get('/logout', function (req, res) {
  req.session.destroy()
  res.sendStatus(200)
})

module.exports = router
