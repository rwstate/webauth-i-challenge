const express = require('express')
const bcrypt = require('bcryptjs')
const session = require('express-session')

const Users = require('./users/user_model.js')

const server = express()

server.use(express.json())

server.use(
  session({
    name: 'sid', 
    secret: 'bugs',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, 
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  })
);

server.post('/api/register', (req,res) => {
  const creds = req.body
  const hash = bcrypt.hashSync(creds.password, 14)
  creds.password = hash

  Users.addUser(creds)
    .then(yes => res.status(201).json(yes))
    .catch(err => res.status(500).json({errMsg: 'error registering user'}))
})

server.get('/api/users', (req,res) => {
  if (req.session && req.session.name) {
    Users.getUsers()
      .then(users => res.status(201).json(users))
      .catch(err => res.status(500).json({errMsg: 'error getting users'}))
  } else {
    res.status(401).json({msg: "No"})
  }
})

server.post('/api/login', (req,res) => {
  Users.checkCreds(req.body)
    .then(user => {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        req.session.name = user.username
        res.status(200).json({msg: "Login successful", username: user.username})
      } else {
        res.status(401).json({msg: "Invalid credentials"})
      }
    })
    .catch(err => {
      res.status(500).json({errMsg: "error validating user"})
    })
})

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out')
      } else {
        res.send('user logged out')
      }
    })
  }
})

module.exports = server