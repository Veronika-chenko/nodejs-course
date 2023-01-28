const express = require('express')
const router = express.Router()

const { authMiddleware } = require('../middlewares/authMiddleware')
const { userValidation } = require('../middlewares/userValidation')
const { subscriptionMiddleware } = require('../middlewares/subscriptionMiddleware')
const { uploadMiddleware } = require('../middlewares/avatarMiddleware')
const { repeatVerifyMiddleware } = require('../middlewares/repeatVerifyMiddleware')
const { asyncWrapper } = require('../../helpers/apiHelpers')

const {
    registrationController,
    loginController,
    logoutController,
    getCurrentController,
    updateSubscriptionController,
    updateAvatarController,
    verifyEmailController,
    repeatVerifyEmailController,
} = require('../../controllers/authControllers')
const { handleAndRenameFile } = require('../middlewares/handleAvatarMiddleware')


router.post('/register', userValidation, asyncWrapper(registrationController))
router.get('/login', userValidation, asyncWrapper(loginController))
router.post('/logout', asyncWrapper(authMiddleware), asyncWrapper(logoutController))
router.get('/current', asyncWrapper(authMiddleware), asyncWrapper(getCurrentController))
router.patch('/', asyncWrapper(authMiddleware), subscriptionMiddleware, asyncWrapper(updateSubscriptionController))
router.patch('/avatars', asyncWrapper(authMiddleware), uploadMiddleware.single('avatar'), asyncWrapper(handleAndRenameFile), asyncWrapper(updateAvatarController))
router.post('/verify/:verificationToken', asyncWrapper(verifyEmailController))
router.post('/verify', asyncWrapper(repeatVerifyMiddleware), asyncWrapper(repeatVerifyEmailController))

module.exports = router