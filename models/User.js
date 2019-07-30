const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const { Schema } = mongoose
const PASSWORDSALTROUND = 3
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255
  }
})

class UserClass {
  static async find (userId) {
    const user = await this.findById(userId)
    return user
  }

  static async register ({ username, password: rawPassword }) {
    const password = await bcrypt.hash(rawPassword, PASSWORDSALTROUND)
    const user = await this.create({ username, password })
    return user
  }

  static async findByUsername (username) {
    const user = await this.findOne({ username })
    return user
  }

  static async authenticate ({ username, password }) {
    if (!username) {
      throw new Error('Username cannot be empty')
    }
    if (!password) {
      throw new Error('Password cannot be empty')
    }
    const user = await this.findByUsername(username)
    if (!user) {
      throw new Error(`Username "${username}" not found.`)
    }
    if (!await bcrypt.compare(password, user.password)) {
      throw new Error(`Password not match.`)
    }
    return user
  }
}

const transform = (doc, ret) => {
  ret.id = ret._id
  delete ret._id
  delete ret.__v
  delete ret.password
}

userSchema.index({ username: 1 }, { unique: true })
userSchema.loadClass(UserClass)
userSchema.set('toObject', { transform })
userSchema.set('toJSON', { transform })

const User = mongoose.model('User', userSchema)

module.exports = {
  User,
  userSchema
}
