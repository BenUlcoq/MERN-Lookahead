const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {


  let token

  if (req.get('Authorization')) {
    token = req.get('Authorization').split(" ")[1]
  }

  else {
    return res.status(401).json({"message": "Access denied. No token provided."})
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    console.log("Yeetog")
    next()
  }
  catch (ex) {
    res.status(400).json({"message":"Invalid auth token."})
  }
}
