const gravatar = require('gravatar');
// const Jimp = require('jimp');
const {
    registration,
    login,
    logout,
    getCurrentUser,
    updateSubscription,
    updateAvatar
} = require('../services/authService')

const registrationController = async (req, res) => {
    const userAvatar = gravatar.url(req.body.email, // відразу згенерувати йому аватар по його email
        { protocol: 'http' }
    );
    console.log('userAvatar:', userAvatar)
    // const {email, password} = req.body
    const newUser = await registration(req.body, userAvatar)

    if (!newUser) {
        return res.status(409).json({"message": "Email in use"})
    }

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
    if (!user) {
        return res.status(401).json({"message": "Email or password is wrong"})
    }

    const { token, user: { email, subscription } } = user 

    res.json({
        token, 
        "user": {email, subscription}
    })
}

const logoutController = async (req, res) => {
    const user = await logout(req.user._id)
    
    if (!user) {
        return res.status(401).json({"message": "Not authorized"})
    }

    res.sendStatus(204)
}

const getCurrentController = async (req, res) => {
    const user = await getCurrentUser(req.user._id)

    if (!user) {
        return res.status(401).json({"message": "Not authorized"})
    }

    res.json({user})
}

const updateSubscriptionController = async (req, res) => {
    const user = req.user._id
    const { subscription: newSubscription } = req.body;
    const { email, subscription } = await updateSubscription(user, newSubscription)
    
    if (!email) {
        return res.status(404).json({"message": "Not found"})
    }

    res.json({email, subscription})
}

const updateAvatarController = async (req, res) => {
    const user = req.user._id
    const { path } = req.file
    
    console.log('path: ', path)
    console.log("req.body:", req.file)
    const avatarURL = await updateAvatar(user, req.body) 
    
    if (!avatarURL) {
        return res.status(401).json({"message": "Not authorized"})
    }
    res.json({avatarURL})
}

// Jimp.read(avatar, (err, avatar) => {
//   if (err) throw err;
//   avatar
//     .resize(20, 250) // resize
//     .quality(60) // set JPEG quality
//     .greyscale() // set greyscale
//     .write('lena-small-bw.jpg'); // save
// });
  
module.exports = {
    registrationController,
    loginController,
    logoutController,
    getCurrentController,
    updateSubscriptionController,
    updateAvatarController
}