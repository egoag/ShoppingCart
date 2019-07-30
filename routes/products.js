var express = require('express')
var router = express.Router()

var { Product } = require('../models/Product')

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           readOnly: true
 *         name:
 *           type: string
 *         price:
 *           type: number
 */

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - product
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res, next) => {
  let { offset, limit } = req.query
  offset = parseInt(offset)
  limit = parseInt(limit)
  const products = await Product.list(offset, limit)
  return res.json(products)
})

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - product
 *     requestBody:
 *       description: Product infomation
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, price } = req.body
    const product = await Product.create({ name, price })
    return res.status(201).json(product)
  } catch (e) {
    return res.status(400).json({ error: e.toString() })
  }
})

module.exports = router
