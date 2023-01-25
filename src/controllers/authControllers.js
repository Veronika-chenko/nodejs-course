const gravatar = require('gravatar');

const {
    registration,
    login,
    logout,
    getCurrentUser,
    updateSubscription,
    updateAvatar
} = require('../services/authService');

const registrationController = async (req, res) => {
    const userAvatar = gravatar.url(req.body.email,
        { protocol: 'http' }
    );
    const newUser = await registration(req.body, userAvatar)

    const { email, subscription, avatarURL } = newUser
    
    res.status(201).json({
        "user": {
            email,
            subscription,
            avatarURL
        }
    })
}

const loginController = async (req, res) => {
    const user = await login(req.body)
    const { token, user: { email, subscription } } = user 

    res.json({
        token, 
        "user": {email, subscription}
    })
}

const logoutController = async (req, res) => {
    await logout(req.user._id)
    res.sendStatus(204)
}

const getCurrentController = async (req, res) => {
    const user = await getCurrentUser(req.user._id)
    res.json({ user })
}

const updateSubscriptionController = async (req, res) => {
    const user = req.user._id
    const { subscription: newSubscription } = req.body
    const { email, subscription } = await updateSubscription(user, newSubscription)

    res.json({ email, subscription })
}
 
const updateAvatarController = async (req, res) => {
    const userId = req.user._id
    const { avatarURL } = req.file

    await updateAvatar(userId, avatarURL)
    res.json({ avatarURL })
}
  
module.exports = {
    registrationController,
    loginController,
    logoutController,
    getCurrentController,
    updateSubscriptionController,
    updateAvatarController
}