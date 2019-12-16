const express = require('express')
const bcrypt = require('bcryptjs')

const Users = require('./users/user_model.js')

const server = express()

server.use(express.json())

server.post('/api/register', (req,res) => {
  const creds = req.body
  const hash = bcrypt.hashSync(creds.password, 14)
  creds.password = hash

  Users.addUser(creds)
    .then(yes => res.status(201).json(yes))
    .catch(err => res.status(500).json({errMsg: 'error registering user'}))
})

server.get('/api/users', (req,res) => {
  Users.getUsers()
    .then(users => res.status(201).json(users))
    .catch(err => res.status(500).json({errMsg: 'error getting users'}))
})

server.post('/api/login', (req,res) => {
  Users.checkCreds(req.body)
    .then(user => {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        res.status(200).json({msg: "Login successful", username: user.username})
      } else {
        res.status(401).json({msg: "Invalid credentials"})
      }
    })
    .catch(err => {
      res.status(500).json({errMsg: "error validating user"})
    })
})

module.exports = server