const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

const config = require('../config')

const authMiddleware = expressJwt({ secret: config.Server.Secret })

const sign = payload => jwt.sign(payload, config.Server.Secret)

module.exports = {
  sign,
  authMiddleware
}
