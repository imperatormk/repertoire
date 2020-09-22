const crypto = require('crypto')
const multer = require('multer')
const mime = require('mime')
const path = require('path')
const fs = require('fs')
const csv = require('csv-parser')

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
        const ext = mime.getExtension(file.mimetype)
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

const checkRepertoire = () => {
  return new Promise((resolve, reject) => {
    const directory = getStoragePath('repertoires')

    const ownRepertoire = path.join(directory, 'own.csv')
    const ownExists = fs.existsSync(ownRepertoire)

    const coverRepertoire = path.join(directory, 'cover.csv')
    const coverExists = fs.existsSync(coverRepertoire)
    
    const resObj = {
      ownExists,
      coverExists
    }
    resolve(resObj)
  })
}

const readRepertoire = () => {
  const readSongsFromCsv = (csvFilename) => {
    const songs = []

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilename)
        .pipe(csv())
        .on('data', (row) => {
          const value = Object.values(row)[0]
          const [title, artist] = value.split(';')
          const song = {
            title,
            artist,
            attachments: []
          }
          songs.push(song)
        })
        .on('end', () => {
          resolve(songs)
        })
    })
  }

  return new Promise((resolve, reject) => {
    const songsP = []
    const songs = []

    const directory = getStoragePath('repertoires')

    const ownRepertoire = path.join(directory, 'own.csv')
    const ownExists = fs.existsSync(ownRepertoire)
    if (ownExists) {
      const ownSongsP = readSongsFromCsv(ownRepertoire)
      songsP.push(ownSongsP)
    }

    const coverRepertoire = path.join(directory, 'cover.csv')
    const coverExists = fs.existsSync(coverRepertoire)
    if (coverExists) {
      const coverSongsP = readSongsFromCsv(coverRepertoire)
      songsP.push(coverSongsP)
    }

    Promise.all(songsP)
      .then(([ownSongs, coverSongs]) => {
        if (ownSongs) {
          ownSongs = ownSongs.map(song => ({ ...song, type: 'own' }))
          songs.push(...ownSongs)
        }
        if (coverSongs) {
          coverSongs = coverSongs.map(song => ({ ...song, type: 'cover' }))
          songs.push(...coverSongs)
        }
        resolve(songs)
      })
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
  checkRepertoire,
  readRepertoire,
  getStoragePath,
  getStorageUrl,
  getStaticFilesPath,
  getStaticFilesUrl,
  generateRandomString,
  roundToDigits
}