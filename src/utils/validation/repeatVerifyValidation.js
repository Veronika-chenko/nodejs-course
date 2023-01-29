const Joi = require('joi')

const repeatVerifyValidation = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
})

module.exports = {
    repeatVerifyValidation
}