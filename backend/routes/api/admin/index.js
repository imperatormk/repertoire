const fs = require('fs')
const path = require('path')
const mime = require('mime')

const router = require('express').Router()
const { uploadMiddleware, checkRepertoire } = require(__basedir + '/helpers')

router.get('/', (req, res) => {
  res.json({ admin: true })
})

const uploadMwRepertoires = uploadMiddleware('repertoires').fields(
  [{
    name: 'repertoire', maxCount: 1
  }, {
    name: 'data'
  }]
)

router.get('/repertoire', async (req, res) => {
  const resObj = await checkRepertoire()
  res.send(resObj)
})

router.post('/repertoire', uploadMwRepertoires, async (req, res) => {
  const file = req.files['repertoire'][0]
  const data = JSON.parse(req.body.data)

  const renameP = () => new Promise((resolve, reject) => {
    const ext = mime.getExtension(file.mimetype)
    const newFilename = path.join(file.destination, `${data.type}.${ext}`)

    fs.rename(file.path, newFilename, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
  await renameP()

  res.json({ success: true })
})

module.exports = router