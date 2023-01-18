const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
// const Jimp = require('jimp');

const FILE_DIR = path.resolve('./tmp') // wrong ../../../tmp

const storage = multer.diskStorage({
    destination: (req, file, cb) => { // error first callback
        cb(null, FILE_DIR)
    },
    filename: (req, file, cb) => {  
        const [, extention] = file.originalname.split('.')
        cb(null, `${uuidv4()}.${extention}`)
    }
})

const uploadMiddleware = multer({ storage })

module.exports = { uploadMiddleware }