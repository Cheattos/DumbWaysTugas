const multer = require('multer')

const store = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/asset/uploads")
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g,"")) /// 1231242315-img.png
  }
})

const upload = multer({
  storage: store
})

module.exports = upload