const { subscriptionValidation } = require('../../utils/validation/subscriptionValidation')
const { ValidationError } = require('../../helpers/errors')

module.exports = {
    subscriptionMiddleware: (req, res, next) => {
        const schema = subscriptionValidation
        const {error} = schema.validate(req.body)
        if (error) {
            next(new ValidationError(error.details[0].message))
        }

        next()
    },
}
