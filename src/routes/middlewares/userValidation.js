const { userFormValidation } = require('../../utils/validation/userFormValidation')
const { ValidationError } = require('../../helpers/errors')

module.exports = {
    userValidation: (req, res, next) => {
        const schema = userFormValidation
        const {error} = schema.validate(req.body)
        if (error) {
            next(new ValidationError(error.details[0].message))
        }
        
        next()
    },
}