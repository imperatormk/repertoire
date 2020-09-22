const crypto = require('crypto')
const multer = require('multer')
const mime = require('mime')
const path = require('path')
const fs = require('fs')

const constants = require(__basedir + '/constants')

const uploadMiddleware = (subFolder) => {
  if (!subFolder) throw { msg: 'subfolderMissing' }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        const storagePath = getStoragePath(subFolder)
        cb(null, storagePath)
      }
      catch(err) {
        cb(err, null)
      }
    },
    filename: (req, file, cb) => {
      crypto.pseudoRandomBytes(16, (err, raw) => {
        let ext = mime.getExtension(file.mimetype)
        cb(null, `${raw.toString('hex')}-${Date.now()}.${ext}`)
      })
    }
  })

  return multer({
    storage: storage,
    limits: {
      fieldSize: 4194304
    }
  })
}

// storage utils

const getStoragePath = (key) => {
  const baseStoragePath = constants.appStoragePath
  const storagePath = path.join(baseStoragePath, key)

  const exists = fs.existsSync(storagePath)
  if (!exists)
    throw { msg: 'invalidPath', details: storagePath }

  return storagePath
}

const getStorageUrl = (key, filename) => {
  const storagePath = getStoragePath(key)
  return path.join(storagePath, filename)
}

// static files utils

const getStaticFilesPath = (key) => {
  const baseStaticFilesPath = constants.staticFilesPath
  return path.join(baseStaticFilesPath, key)
}

const getStaticFilesUrl = (key, filename) => {
  const staticFilesPath = getStaticFilesPath(key)
  return path.join(staticFilesPath, filename)
}

const generateRandomString = (len) => {
  const realLen = Math.floor(len / 2)
  const str = crypto.randomBytes(realLen).toString('hex')
  return str
}

const roundToDigits = (value, digits) => {
  const digitValue = digits || 8
  const numericValue = Number(value)
  if (isNaN(numericValue)) return null
  if (numericValue < 10 ** -digitValue) return 0
  return +numericValue.toFixed(digitValue)
}

module.exports = {
  uploadMiddleware,
  getStoragePath,
  getStorageUrl,
  getStaticFilesPath,
  getStaticFilesUrl,
  generateRandomString,
  roundToDigits
}