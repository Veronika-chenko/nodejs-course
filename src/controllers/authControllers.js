const fs = require('fs').promises
const path = require('path')
const gravatar = require('gravatar')
const { v4: uuidv4 } = require('uuid')
const Jimp = require('jimp'); 

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

    res.json({ user })
}

const updateSubscriptionController = async (req, res) => {
    const user = req.user._id
    const { subscription: newSubscription } = req.body;
    const { email, subscription } = await updateSubscription(user, newSubscription)
    
    if (!email) {
        return res.status(404).json({"message": "Not found"})
    }

    res.json({ email, subscription })
}
 
const updateAvatarController = async (req, res) => {
    try {
        const userId = req.user._id
        const { path: tmpPath, originalname } = req.file
        
        const [extention] = originalname.split('.').reverse()
        const newName = `${uuidv4()}.${extention}`
        const newPath = path.resolve('./public/avatars')
        const uploadPath = path.join(newPath, newName)
        
        await fs.rename(tmpPath, uploadPath)
        const avatarURL = path.join('avatars', newName)
    
        const user = await updateAvatar(userId, avatarURL)
        if (!user) {
            return res.status(401).json({"message": "Not authorized"})
        }
        Jimp.read(uploadPath, (err, img) => {
            if (err) throw err;
            img.resize(250, 250).write(uploadPath);
        });
        res.json({ avatarURL })
    } catch (error) {
        await fs.unlink(req.file.path)
        throw error
    }
}
  
module.exports = {
    registrationController,
    loginController,
    logoutController,
    getCurrentController,
    updateSubscriptionController,
    updateAvatarController
}