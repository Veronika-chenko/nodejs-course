const gravatar = require('gravatar')
const { v4: uuidv4 } = require('uuid')
const { User } = require('../db/userModel.js')
const { WrongParamsError } = require('../helpers/errors')

const {
    registration,
    login,
    logout,
    getCurrentUser,
    updateSubscription,
    updateAvatar,
} = require('../services/authService');
const sendEmail = require('../helpers/sendEmail');

const registrationController = async (req, res) => {
    const userAvatar = gravatar.url(req.body.email,
        { protocol: 'http' }
    );
    const verificationToken = uuidv4()

    const newUser = await registration({...req.body, verificationToken}, userAvatar)
    const { email, subscription, avatarURL } = newUser

    const mail = {
        to: email,
        subject: "Submit email",
        html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Verify email</a>`
    }
    await sendEmail(mail)

    res.status(201).json({
        "user": {
            email,
            subscription,
            avatarURL,
            verificationToken
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

const verifyEmailController = async(req, res) => {
    const {verificationToken} = req.params
    const user = await User.findOne({verificationToken});
    if(!user) {
        throw new WrongParamsError('User not found')
    }
    await User.findByIdAndUpdate(user._id, 
        {verify: true, verificationToken: null })

    res.json({
        message: 'Verification successful'
    })
}

const repeatVerifyEmailController = async(req, res) => {
    const { email } = req.body
    const user = await User.findOne({email})

    if(!user) {
        throw new WrongParamsError('User not found')
    }
    if(user.verify) {
        throw new WrongParamsError('Verification has already been passed')
    }

    await User.findByIdAndUpdate(user._id, 
        {verify: true, verificationToken: null })

    res.json({message: 'Verification email sent'})
}
  
module.exports = {
    registrationController,
    loginController,
    logoutController,
    getCurrentController,
    updateSubscriptionController,
    updateAvatarController,
    verifyEmailController,
    repeatVerifyEmailController,
}