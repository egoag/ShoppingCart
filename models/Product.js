const mongoose = require('mongoose')

const { Schema } = mongoose
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
})

class ProductClass {
  static async list (offset = 0, limit = 100) {
    const products = await this.find({})
      .skip(offset)
      .limit(limit)
    return products
  }

  static async get (productId) {
    const product = await this.findById(productId)
    return product
  }
}

const transform = (doc, ret) => {
  ret.id = ret._id
  ret.price = Math.floor(ret.price * 100) / 100 // round or floor
  // ret.price = ret.price.toFixed(2)
  delete ret._id
  delete ret.__v
}

productSchema.index({ name: 1 }, { unique: true })
productSchema.loadClass(ProductClass)
productSchema.set('toObject', { transform })
productSchema.set('toJSON', { transform })

const Product = mongoose.model('Product', productSchema)

module.exports = {
  Product,
  productSchema
}
