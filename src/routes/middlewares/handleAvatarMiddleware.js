const fs = require('fs/promises')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const Jimp = require('jimp')

const handleAndRenameFile = async(req, res, next) => {
    const { path: tmpPath, originalname } = req.file

    const [extention] = originalname.split('.').reverse()
    const newName = `${uuidv4()}.${extention}`

    const newPath = path.resolve('./public/avatars')
    const uploadPath = path.join(newPath, newName)
    
    try {
        await fs.rename(tmpPath, uploadPath)
        const avatarURL = `/avatars/${newName}`

        Jimp.read(uploadPath)
            .then(img => {
                return img.resize(250, 250).write(uploadPath);
            })
            .catch(err => {
                console.log(err)
            })
        
        req.file.avatarURL = avatarURL
    } catch (error) {
        await fs.unlink(req.file.path)
        throw error
    }
    next()
}

module.exports = {
    handleAndRenameFile
}