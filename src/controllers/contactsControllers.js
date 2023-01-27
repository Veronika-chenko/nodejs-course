const {
    getContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    updateStatusContact
} = require('../services/contactsService')

const getContactsController = async (req, res) => {
    const { _id: userId } = req.user

    let {
        limit = 5,
        page = 1,
        favorite
    } = req.query
    limit = limit > 5 ? 5 : limit
    page = page > 0 ? page : 1
    const skip = (page - 1) * limit

    const contacts = await getContacts(userId, favorite, skip, limit)
    res.json({contacts, skip, limit})
}

const getContactByIdController = async (req,res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId)

    res.json({contact})
}

const addContactController = async (req, res) => {
    const { _id: userId } = req.user
    const newContact = await addContact(req.body, userId)

    res.status(201).json({newContact})
}
  
const removeContactController = async (req, res) => {
    const { contactId } = req.params
    await removeContact(contactId)

    res.json({"message": "Contact deleted"})
}

const updateContactController = async (req, res) => {
    const { contactId } = req.params;
    const contactUpdate = await updateContact(contactId, req.body)

    res.json({contactUpdate})
}
 
const updateStatusContactController = async (req, res) => {
    const { contactId } = req.params;
    const contactUpdateStatus = await updateStatusContact(contactId, req.body)

    res.json({contactUpdateStatus})
}

module.exports = {
    getContactsController,
    getContactByIdController,
    removeContactController,
    addContactController,
    updateContactController,
    updateStatusContactController
}