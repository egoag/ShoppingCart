const mongoose = require('mongoose')

const { User } = require('./User')
const { productSchema, Product } = require('./Product')
const { floorToFixed } = require('../libs/utils')

const { Schema } = mongoose
const cartProductSchema = new Schema({
  product: productSchema,
  quantity: {
    type: Number,
    require: true,
    max: 1024,
    validate: {
      validator: n => n > 0 && n < 1024 && Number.isInteger(n),
      message: '{VALUE} is not an integer'
    }
  }
})

class CartProductClass {
  increase (quantity = 1) {
    this.quantity += quantity
  }

  decrease (quantity = 1) {
    this.quantity -= quantity
  }

  setQuantity (quantity) {
    this.quantity = quantity
  }

  getTotal () {
    return this.quantity * this.product.price
  }
}

const cartProductTransform = (doc, ret) => {
  ret.id = ret._id
  ret.total = floorToFixed(doc.getTotal(), 2)
  delete ret._id
  delete ret.__v
}

cartProductSchema.loadClass(CartProductClass)
cartProductSchema.set('toObject', { transform: cartProductTransform })
cartProductSchema.set('toJSON', { transform: cartProductTransform })

const CartProduct = mongoose.model('CartProduct', cartProductSchema)

const shoppingCartSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  cartProducts: [cartProductSchema]
})

class ShoppingCartClass {
  static async getByUserId (userId) {
    let shoppingCart = await this.findOne({ userId })
    if (!shoppingCart) {
      const user = User.find(userId)
      if (!user) {
        throw new Error(`User Id ${userId} not found`)
      }
      shoppingCart = await this.create({ userId })
    }
    return shoppingCart
  }

  getTotal () {
    return this.cartProducts.reduce((acc, product) => {
      return acc + product.product.price * product.quantity
    }, 0)
  }

  async putProduct (productId, quantity) {
    const cartProduct = this.getCartProductByProductId(productId)
    if (cartProduct) {
      cartProduct.increase(quantity)
    } else {
      const product = await Product.get(productId)
      if (!product) {
        throw new Error(`Product Id ${productId} not found`)
      }
      this.cartProducts.push(new CartProduct({ product, quantity }))
    }
  }

  popProduct (productId, quantity) {
    const cartProduct = this.getCartProductByProductId(productId)
    if (!cartProduct) {
      throw new Error(`Product Id ${productId} not found`)
    } else {
      cartProduct.decrease(quantity)
      if (cartProduct.quantity <= 0) {
        cartProduct.remove()
      }
    }
  }

  async setQuantity (productId, quantity) {
    const cartProduct = this.getCartProductByProductId(productId)
    if (!cartProduct) {
      const product = await Product.get(productId)
      if (!product) {
        throw new Error(`Product Id ${productId} not found`)
      }
      this.cartProducts.push(new CartProduct({ product, quantity }))
    } else {
      cartProduct.setQuantity(quantity)
      if (cartProduct.quantity <= 0) {
        cartProduct.remove()
      }
    }
  }

  removeProduct (productId) {
    const cartProduct = this.getCartProductByProductId(productId)
    if (!cartProduct) {
      throw new Error(`Product Id ${productId} not found`)
    }
    this.removeCartProduct(cartProduct.id)
  }

  removeCartProduct (cartProductId) {
    this.cartProducts.id(cartProductId).remove()
  }

  getCartProductByProductId (productId) {
    return this.cartProducts.find(cartProduct => {
      return cartProduct.product.id === productId
    })
  }

  clear () {
    this.cartProducts.forEach(cp => cp.remove())
  }
}

const transform = (doc, ret) => {
  ret.total = floorToFixed(doc.getTotal(), 2) // calculate total price
  ret.products = ret.cartProducts.map(cartProduct => {
    cartProduct = { ...cartProduct.product, ...cartProduct }
    delete cartProduct.product
    return cartProduct
  })
  delete ret._id
  delete ret.__v
  delete ret.cartProducts
}

shoppingCartSchema.index({ userId: 1 }, { unique: true })
shoppingCartSchema.loadClass(ShoppingCartClass)
shoppingCartSchema.set('toObject', { transform })
shoppingCartSchema.set('toJSON', { transform })

const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema)

module.exports = {
  ShoppingCart,
  shoppingCartSchema,
  ShoppingProduct: CartProduct,
  shoppingProductSchema: cartProductSchema
}
