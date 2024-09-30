const multer = require('multer')

const storage = multer.diskStorage({
    destination : (req,res,callback) => {
        callback(null,'./profileimgs')
    },
    filename:(req,file,callback) => {
        const filename = `image-${Date.now()}-${file.originalname}`
        callback(null,filename)
    }
})

const multerMiddleware = multer({
    storage
})

module.exports = multerMiddleware