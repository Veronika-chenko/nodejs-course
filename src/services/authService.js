const { User } = require('../db/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registration = async ({email, password}, avatarURL) => {
    const user = new User({ email, password, avatarURL})
    console.log("userresult:", {email, password, avatarURL })
    await user.save();
    return user
}

const login = async ({email, password}) => {
    const user = await User.findOne({email})

    if (!user) {
        return null
    }

    if (!await bcrypt.compare(password, user.password)) {
        return null
    }

    const token = jwt.sign({
        _id: user._id,
    }, process.env.JWT_SECRET)
    await User.findOneAndUpdate(user._id, { $set: {token: token} },)

    return {token, user}
}

const logout = async (id) => {
    const user = await User.findByIdAndUpdate(id, {$set: {token: null}})

    if (!user) {
        return null
    }

    return user
}

const getCurrentUser = async (id) => {
    const user = await User.findById(id, {email: 1, subscription: 1, _id: 0 } )
    if (!user) {
        return null
    }
    return user
}

const updateSubscription = async (id, subscription) => {
    const user = await User.findByIdAndUpdate(
        id,
        { $set: { subscription } },
        { new: true})
    if (!user) {
        return null
    }
    return user
}

const updateAvatar = async (id, avatar) => {
    console.log("avatar:", avatar)
    const user = await User.findByIdAndUpdate(
        id,
        { $set: { avatar } },
        { new: true })
    if (!user) {
        return null
    }
    return user
}

module.exports = {
    registration,
    login,
    logout,
    getCurrentUser,
    updateSubscription,
    updateAvatar
}