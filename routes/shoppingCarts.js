var express = require('express')
var router = express.Router()

var { authMiddleware } = require('../libs/auth')
var { ShoppingCart } = require('../models/ShoppingCart')

router.use(authMiddleware)

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     ShoppingCart:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         total:
 *           type: number
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartProduct'
 *     CartProduct:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           readOnly: true
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: integer
 */

/**
 * @swagger
 * /shoppingCarts:
 *   get:
 *     tags:
 *       - shopping cart
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res, next) => {
  try {
    const shoppingCart = await ShoppingCart.getByUserId(req.user.id)
    return res.json(shoppingCart)
  } catch (e) {
    return res.status(400).json({ result: 'failed', message: e.toString() })
  }
})

/**
 * @swagger
 * /shoppingCarts/add:
 *   post:
 *     tags:
 *       - shopping cart
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                productId:
 *                  type: string
 *                quantity:
 *                  type: integer
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post('/add', async (req, res, next) => {
  const { productId, quantity } = req.body
  if (quantity <= 0) {
    return res.status(400).json({ error: 'quantity must be greater than 0' })
  }
  try {
    const shoppingCart = await ShoppingCart.getByUserId(req.user.id)
    await shoppingCart.putProduct(productId, quantity)
    await shoppingCart.save()
    return res.json(shoppingCart)
  } catch (e) {
    return res.status(400).json({ result: 'failed', message: e.toString() })
  }
})

/**
 * @swagger
 * /shoppingCarts/pop:
 *   post:
 *     tags:
 *       - shopping cart
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                productId:
 *                  type: string
 *                quantity:
 *                  type: integer
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post('/pop', async (req, res, next) => {
  const { productId, quantity } = req.body
  if (quantity <= 0) {
    return res.status(400).json({ error: 'quantity must be greater than 0' })
  }
  try {
    const shoppingCart = await ShoppingCart.getByUserId(req.user.id)
    await shoppingCart.popProduct(productId, quantity)
    await shoppingCart.save()
    return res.json(shoppingCart)
  } catch (e) {
    return res.status(400).json({ result: 'failed', message: e.toString() })
  }
})

/**
 * @swagger
 * /shoppingCarts/set:
 *   post:
 *     tags:
 *       - shopping cart
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                productId:
 *                  type: string
 *                quantity:
 *                  type: integer
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post('/set', async (req, res, next) => {
  const { productId, quantity } = req.body
  if (quantity < 0) {
    return res.status(400).json({ error: 'quantity must be equal to or greater than 0' })
  }
  try {
    const shoppingCart = await ShoppingCart.getByUserId(req.user.id)
    await shoppingCart.setQuantity(productId, quantity)
    await shoppingCart.save()
    return res.json(shoppingCart)
  } catch (e) {
    return res.status(400).json({ result: 'failed', message: e.toString() })
  }
})

/**
 * @swagger
 * /shoppingCarts/remove:
 *   post:
 *     tags:
 *       - shopping cart
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                productId:
 *                  type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post('/remove', async (req, res, next) => {
  const { productId } = req.body
  try {
    const shoppingCart = await ShoppingCart.getByUserId(req.user.id)
    shoppingCart.removeProduct(productId)
    await shoppingCart.save()
    return res.json(shoppingCart)
  } catch (e) {
    return res.status(400).json({ error: e.toString() })
  }
})

/**
 * @swagger
 * /shoppingCarts/clear:
 *   post:
 *     tags:
 *       - shopping cart
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post('/clear', async (req, res, next) => {
  try {
    const shoppingCart = await ShoppingCart.getByUserId(req.user.id)
    shoppingCart.clear()
    await shoppingCart.save()
    return res.json(shoppingCart)
  } catch (e) {
    return res.status(400).json({ error: e.toString() })
  }
})

module.exports = router
