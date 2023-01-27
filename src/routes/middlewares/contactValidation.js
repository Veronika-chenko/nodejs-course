const { contactFormValidation, updateStatusValidation } = require('../../utils/validation/contactFormValidation')
const { ValidationError } = require('../../helpers/errors')

module.exports = {
    addContactValidation: (req, res, next) => {
        const schema = contactFormValidation
        const {error} = schema.validate(req.body)
        if (error) {
            next(new ValidationError(error.details[0].message))
        }
        
        next()
    },
    changeContactValidation: (req, res, next) => {
        const schema = contactFormValidation
        const {error} = schema.validate(req.body)
        if (error) {
            next(new ValidationError(error.details[0].message))
        }

        next()
    },
    updateStatusValidation: (req, res, next) => {
        const schema = updateStatusValidation
        const {error} = schema.validate(req.body)
        if (error) {
            next(new ValidationError(error.details[0].message))
        }

        next()
    },
}