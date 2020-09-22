const fs = require('fs')
const express = require('express')
const router = express.Router()

const helpers = require(__basedir + '/helpers')

const apiRoutes = require('./api')
const errorHandler = require('./error-handler')

let startDate = new Date()

router.get('/', (_, res) => {
  return res.send({
    sane: true,
	  startDate
  })
})

const staticFiles = ['repertoires']
staticFiles.forEach((staticFile) => {
  if (!fs.existsSync(staticFile)) {
    fs.mkdirSync(staticFile)
  }

  const staticPath = helpers.getStaticFilesPath(staticFile)
  const storagePath = helpers.getStoragePath(staticFile)

  router.use(staticPath, express.static(storagePath))
})

router.use('/api', apiRoutes)
router.use(errorHandler)

module.exports = router