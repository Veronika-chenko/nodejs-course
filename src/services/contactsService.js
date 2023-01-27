const { Contact } = require('../db/contactModel')
const { WrongParamsError } = require('../helpers/errors')

const getContacts = async (owner, favorite, skip, limit) => {
    const filteredContacts = !favorite ? { owner } : { owner, favorite: favorite }
    const contacts = await Contact.find(filteredContacts)
        .select({ __v: 0 })
        .skip(skip)
        .limit(limit)  
    return contacts;
}

const getContactById = async (contactId) => {
    const contact = await Contact.findById(contactId)
    if (!contact) {
        throw new WrongParamsError("Contact not found")
    };
    return contact
}

const addContact = async (body, owner) => {
    const { name, email, phone, favorite } = body
    const contact = await Contact.create({ name, email, phone, favorite, owner })
    return contact
}

const removeContact = async (contactId) => {
    const contact = await Contact.findByIdAndDelete(contactId)
    if (!contact) {
        throw new WrongParamsError("Contact not found")
    }
}

const updateContact = async (contactId, body) => {
    const contactUpdate = await Contact.findByIdAndUpdate(
        contactId,
        body,
        { new: true }) 

    if (!contactUpdate) {
        throw new WrongParamsError("Contact not found")
    }
    return contactUpdate
}

const updateStatusContact = async (contactId, favorite, owner) => {
    const contactUpdateStatus = await Contact.findByIdAndUpdate(
        contactId,
        favorite,
        { new: true }
    )

    if (!contactUpdateStatus) {
        throw new WrongParamsError("Contact not found")
    }
    return contactUpdateStatus
}


module.exports = {
    getContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    updateStatusContact
}