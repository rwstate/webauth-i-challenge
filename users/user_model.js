const db = require('../data/dbConfig.js');

function addUser(creds) {
  return db('user').insert(creds)
}

function getUsers() {
  return db('user').column('username')
}

function checkCreds(creds) {
  return (
    db('user')
      .where({username: creds.username})
      .first()
  )
}

module.exports = {
  addUser,
  getUsers,
  checkCreds
}