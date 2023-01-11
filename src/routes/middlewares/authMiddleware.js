const jwt = require('jsonwebtoken')
const { User } = require('../../db/userModel')

module.exports = {
    authMiddleware: async (req, res, next) => {
        const [, token] = req.headers.authorization.split(' ')

        if (!token) {
            return res.status(401).json({"message": "Not authorized"})
        }

        const userToken = jwt.decode(token, process.env.JWT_SECRET)
        const user = await User.findById(userToken?._id)

        if (!user || user.token !== token) {
            return res.status(401).json({"message": "Not authorized"})
        }
        
        req.token = token
        req.user = user
        next()
    },
}