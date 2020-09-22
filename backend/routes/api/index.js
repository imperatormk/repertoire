const router = require('express').Router()

const { authMiddleware, adminMiddleware } = require(__basedir + '/services/auth/middleware')

const accountsRoutes = require('./accounts')
router.use('/accounts', accountsRoutes)

const authRoutes = require('./auth')
router.use('/auth', authRoutes)

const adminRoutes = require('./admin')
router.use('/admin', authMiddleware(), adminRoutes)

const gigsRoutes = require('./gigs')
router.use('/gigs', authMiddleware(), gigsRoutes)

const songsRoutes = require('./songs')
router.use('/songs', authMiddleware(), songsRoutes)

const requestsRoutes = require('./requests')
router.use('/requests', authMiddleware(), requestsRoutes)

const convertToNumbers = (req, res, next) => {
  const params = req.params
  Object.keys(params).forEach((paramKey) => {
  	if (!isNan(params[paramKey])) {
      req.params[paramKey] = Number(params[paramKey])
    }
  })
  next()
}
router.use(convertToNumbers) // doesn't work atm

module.exports = router 