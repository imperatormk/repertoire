const router = require('express').Router()

const { uploadMiddleware } = require(__basedir + '/helpers')

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

router.post('/repertoire', uploadMwRepertoires, (req, res) => {
  const url = req.files['repertoire'][0].filename
  const data = JSON.parse(req.body.data)
  console.log(url, data)

  res.json({ success: true })
})

module.exports = router