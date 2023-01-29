const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const { User } = require('../db/userModel')
const { UnauthorizedError, WrongParamsError, ConflictError } = require('../helpers/errors')

const registration = async ({email, password, verificationToken}, avatarURL) => {
    try {
        const user = await User.create({ email, password, verificationToken, avatarURL })

        return user
    } catch (error) {
        if (error.message.includes('E11000 duplicate key error')) {
            throw new ConflictError("Email in use")
        }
        throw error
    }
}

const login = async ({email, password}) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthorizedError("Email or password is wrong")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new UnauthorizedError("Email or password is wrong")
    }

    const token = jwt.sign({
        _id: user._id,
    }, JWT_SECRET)
    await User.findOneAndUpdate(user._id, {token: token})

    return {token, user}
}

const logout = async (id) => {
    const user = await User.findByIdAndUpdate(id, {token: null})
    
    if (!user) {
        throw new UnauthorizedError("Not authorized")
    }

    if (!user.verify) {
        throw new UnauthorizedError("Email not verified")
    }

    return user
}

const getCurrentUser = async (id) => {
    const user = await User.findById(id, {email: 1, subscription: 1, _id: 0 } )
    if (!user) {
        throw new UnauthorizedError("Not authorized")
    }

    return user
}

const updateSubscription = async (id, subscription) => {
    const user = await User.findByIdAndUpdate(
        id,
        { subscription },
        { new: true }
    )
    if (!user) {
        throw new WrongParamsError("Not found")
    }
    return user
}

const updateAvatar = async (id, avatarURL) => {
    const user = await User.findByIdAndUpdate(
        id,
        { avatarURL },
        { new: true }
    )
    if (!user) {
        throw new UnauthorizedError("Not authorized")
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
