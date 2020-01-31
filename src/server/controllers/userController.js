const { UserModel, validateUser } = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')

async function register(req, res) {
  const { error } = validateUser(req.body)
  if (error) return res.status(400).json({"message": 'Invalid user data.'})

  let user = await UserModel.findOne({ email: req.body.email })

  if(user) return res.status(409).send('An account already exists with that email.')

  user = new UserModel(_.pick(req.body, ['firstName',
                                    'lastName',
                                    'email',
                                    'password',
                                    'position'
                                  ]))
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  const token = user.generateAuthToken()

  res.header('x-auth-token', token).status(201).json({message:`User ${user.email} successfully created.`})
}

async function updateDetails(req, res) {
  const validUser = await UserModel.findById(req.user._id)
  if (!validUser) return res.status(404).json({"message": "Couldn't find user."})

  validUser.firstName = req.body.firstName
  validUser.lastName = req.body.lastName
  validUser.position = req.body.position
  validateUser(validUser)

  await validUser.save()
  res.status(200).json({"message": "Account Details Successfully Updated"})
}

module.exports = { register, updateDetails }