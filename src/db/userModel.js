const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const subscriptionTypes = ["starter", "pro", "business"]

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: subscriptionTypes,
    default: "starter"
  },
  avatarURL: {
    type: String,
    require: true,
  },
  token: {
    type: String,
    default: null,
  }
})

userSchema.pre('save', async function() {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10)
  }
})

const User = mongoose.model('User', userSchema)

module.exports = {
  User,
  subscriptionTypes
}