import multer from "multer"
import crypto from "crypto"


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/static')
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(16, function (err, raw) {
      if (err) return cb(err)
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      cb(null, `${raw.toString("hex")}-${safeName}`)
    })
  }
})

export const upload = multer({ storage: storage })
