const express = require('express')
const router = express.Router()

const { User } = require('../models/User')
const { sign } = require('../libs/auth')

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           readOnly: true
 *         username:
 *           type: string
 *         password:
 *           type: string
 *           writeOnly: true
 *           format: password
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /users/authentication:
 *   post:
 *     tags:
 *       - user
 *     requestBody:
 *       description: Returns token
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post('/authentication', async (req, res, next) => {
  const { username, password } = req.body
  try {
    const user = await User.authenticate({ username, password })
    const token = sign(user.toObject())
    return res.json({ token })
  } catch (e) {
    return res.status(400).json({ error: e.toString() })
  }
})

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *       - user
 *     requestBody:
 *       description: User registration
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post('/register', async (req, res, next) => {
  const { username, password } = req.body
  try {
    const user = await User.register({ username, password })
    return res.status(201).json(user)
  } catch (e) {
    return res.status(400).json({ error: e.toString() })
  }
})

module.exports = router
