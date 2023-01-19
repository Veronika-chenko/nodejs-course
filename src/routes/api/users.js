const express = require('express')
const router = express.Router()

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

router.post('/register', userValidation, asyncWrapper(registrationController))
router.get('/login', userValidation, asyncWrapper(loginController))
router.post('/logout', authMiddleware, asyncWrapper(logoutController))
router.get('/current', authMiddleware, asyncWrapper(getCurrentController))
router.patch('/', authMiddleware, subscriptionMiddleware, asyncWrapper(updateSubscriptionController))
router.patch('/avatars', authMiddleware, uploadMiddleware.single('avatar'), asyncWrapper(updateAvatarController))

module.exports = router