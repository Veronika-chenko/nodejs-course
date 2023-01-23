const fs = require('fs/promises')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const Jimp = require('jimp')

const handleAndRenameFile = async(reqFile) => {
    try {
        const { path: tmpPath, originalname } = reqFile
        const [extention] = originalname.split('.').reverse()
        const newName = `${uuidv4()}.${extention}`
        const newPath = path.resolve('./public/avatars')
        const uploadPath = path.join(newPath, newName)

        await fs.rename(tmpPath, uploadPath)
        const avatarURL = path.join('avatars', newName)

        Jimp.read(uploadPath)
            .then(img => {
            return img.resize(250, 250).write(uploadPath);
            })
            .catch(err => {
                console.log(err)
            }) 
        return avatarURL
    } catch (error) {
        await fs.unlink(reqFile.path)
        throw error
    }
}

module.exports = {
    handleAndRenameFile
}