const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const { User } = require('../../db/userModel')
const { HttpError } = require('../../helpers/apiHelpers')

module.exports = {
    authMiddleware: async (req, res, next) => {
        const [type, token] = req.headers.authorization.split(' ')
        
        if (type !== 'Bearer') {
            throw HttpError(401, "Token type is not valid")
        }

        if (!token) {
            throw HttpError(401, "Not authorized")
        }
        
        try {    
            const userToken = jwt.verify(token, JWT_SECRET)
            const user = await User.findById(userToken._id)

            req.token = token
            req.user = user
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                throw HttpError(401, "jwt token is not valid")
            }
            throw error
        }
        
        next()
    },
}