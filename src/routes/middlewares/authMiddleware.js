const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const { User } = require('../../db/userModel')
const { UnauthorizedError } = require('../../helpers/errors')

module.exports = {
    authMiddleware: async (req, res, next) => {
        const [type, token] = req.headers.authorization.split(' ')
        
        if (type !== 'Bearer') {
            next(new UnauthorizedError('Token type is not valid'))
        }

        if (!token) {
            next(new UnauthorizedError('Not authorized'))
        }
        
        try {    
            const userToken = jwt.verify(token, JWT_SECRET)
            const user = await User.findById(userToken._id)

            req.token = token
            req.user = user
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                next(new UnauthorizedError('jwt token is not valid'))
            }
            throw error
        }
        
        next()
    },
}