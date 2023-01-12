const { Contact } = require('../db/contactModel')

const getContacts = async (owner, favorite, skip, limit) => {
    const filteredContacts = !favorite ? { owner } : { owner, favorite: favorite }
    const contacts = await Contact.find(filteredContacts)
        .select({ __v: 0 })
        .skip(skip)
        .limit(limit)  
    return contacts;
}

const getContactById = async (contactId, owner) => {
    const contact = await Contact.findOne({_id: contactId, owner})
    if (!contact) {
        return null
    };
    return contact
}

const addContact = async (body, owner) => {
    const { name, email, phone, favorite } = body
    const contact = new Contact({ name, email, phone, favorite, owner })
    await contact.save()
    return contact
}

const removeContact = async (contactId, owner) => {
    const contact = await Contact.findOneAndRemove({_id: contactId, owner})
    if (!contact) {
        return null
    }
    return contact
}

const updateContact = async (contactId, body, owner) => {
    const contactUpdate = await Contact.findOneAndUpdate(
        {_id: contactId, owner},
        { $set: body },
        { new: true }) 
    return contactUpdate
}

const updateStatusContact = async (contactId, favorite, owner) => {
    const contactUpdateStatus = await Contact.findOneAndUpdate(
        {_id: contactId, owner},
        favorite,
        { new: true })
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