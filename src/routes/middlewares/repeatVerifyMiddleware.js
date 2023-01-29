const { repeatVerifyValidation } = require('../../utils/validation/repeatVerifyValidation')
const { ValidationError } = require('../../helpers/errors')

module.exports = {
    repeatVerifyMiddleware: (req, res, next) => {
        const schema = repeatVerifyValidation
        const {error} = schema.validate(req.body)
        if (error) {
            next(new ValidationError('missing required field email'))
        }

        next()
    },
}


