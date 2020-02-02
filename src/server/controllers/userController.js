const { UserModel, validateUser, validateEmail, validatePassword } = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')

async function details(req, res) {
  const user = await UserModel.findById(req.user._id).select('-password')
  res.send(user)
}

async function register(req, res) {
  const { error } = validateUser(req.body)
  if (error) return res.status(400).json({"message": 'Invalid user data.'})

  let user = await UserModel.findOne({ email: req.body.email })
  if(user) return res.status(409).json({"message": "An account already exists with that email."})


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

  res.status(201).json({"message":`User ${user.email} successfully created.`, "token": token})
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

async function updatePassword(req, res) {

  const validUser = await UserModel.findById(req.user._id)
  if (!validUser) return res.status(404).json({"message": "Couldn't find user."})

  const validPassword = await bcrypt.compare(req.body.currentPassword, validUser.password)
  if (!validPassword) return res.status(401).json({"message":"Invalid Email or Password."})

  const { error } = validatePassword({password: req.body.newPassword})
  if (error) return res.status(400).json({"message": 'Invalid password.'})

  const salt = await bcrypt.genSalt(10)
  validUser.password = await bcrypt.hash(req.body.newPassword, salt)

  await validUser.save()
  res.status(200).json({"message": "Password updated succesfully."})
}

async function updateEmail(req, res) {
  const validUser = await UserModel.findById(req.user._id)
  if (!validUser) return res.status(404).json({"message": "Couldn't find user."})

  const validPassword = await bcrypt.compare(req.body.password, validUser.password)
  if (!validPassword) return res.status(400).json({"message":'Incorrect Password'})

  let user = await UserModel.findOne({ email: req.body.email })
  if(user) return res.status(409).json({"message": "An account already exists with that email."})

  const { error } = validateEmail({email: req.body.email})
  if (error) return res.status(400).json({"message": 'Email address must be a valid email.'})

  validUser.email = req.body.email

  await validUser.save()
  res.status(200).json({"message": "Email updated successfully."})
}

module.exports = { register, updateDetails, updatePassword, updateEmail, details }