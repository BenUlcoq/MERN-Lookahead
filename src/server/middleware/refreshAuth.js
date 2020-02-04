const jwt = require('jsonwebtoken')
const { UserModel } = require('../models/user')

module.exports = function (req, res) {

  let data = res.locals

  data.token = res.locals.validUser.generateAuthToken()

  delete data.validUser

  res.json( data )

}