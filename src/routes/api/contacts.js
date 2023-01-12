const express = require('express')
const router = express.Router()

const { authMiddleware } = require('../middlewares/authMiddleware')
const {
    addContactValidation,
    changeContactValidation,
    updateStatusValidation
} = require('../middlewares/contactValidation')
const { asyncWrapper } = require('../../helpers/apiHelpers')

const {
    getContactsController,
    getContactByIdController,
    removeContactController,
    addContactController,
    updateContactController,
    updateStatusContactController
} = require('../../controllers/contactsControllers')

router.use(authMiddleware)

router.get('/', asyncWrapper(getContactsController))
router.get('/:contactId', asyncWrapper(getContactByIdController))
router.post('/', addContactValidation, asyncWrapper(addContactController))
router.delete('/:contactId', asyncWrapper(removeContactController))
router.put('/:contactId', changeContactValidation, asyncWrapper(updateContactController))
router.patch('/:contactId/favorite', updateStatusValidation, asyncWrapper(updateStatusContactController))

module.exports = router