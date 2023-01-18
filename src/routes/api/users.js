const express = require('express')
const router = express.Router()
// const path = require('path')

const { authMiddleware } = require('../middlewares/authMiddleware')
const { userValidation } = require('../middlewares/userValidation')
const { subscriptionMiddleware } = require('../middlewares/subscriptionMiddleware')
const { uploadMiddleware } = require('../middlewares/avatarMiddleware')
const { asyncWrapper } = require('../../helpers/apiHelpers')

const {
    registrationController,
    loginController,
    logoutController,
    getCurrentController,
    updateSubscriptionController,
    updateAvatarController
} = require('../../controllers/authControllers')

// const FILE_DIR = path.resolve('avatars')
// console.log("FILE_DIR: ",  FILE_DIR)

router.post('/register', userValidation, asyncWrapper(registrationController))
router.get('/login', userValidation, asyncWrapper(loginController))
router.post('/logout', authMiddleware, asyncWrapper(logoutController))
router.get('/current', authMiddleware, asyncWrapper(getCurrentController))
router.patch('/', authMiddleware, subscriptionMiddleware, asyncWrapper(updateSubscriptionController))
// router.get('/avatars', express.static(FILE_DIR))
router.patch('/avatars', authMiddleware, uploadMiddleware.single('avatar'), asyncWrapper(updateAvatarController))
// http://locahost:<порт>/avatars/<ім'я файлу з розширенням>

module.exports = router