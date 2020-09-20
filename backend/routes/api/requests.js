const router = require('express').Router()
const db = require(__basedir + '/db/controllers')

router.get('/', async (req, res, next) => {
  try {
    const requests = await db.requests.getAll()
    const suggestions = await db.suggestions.getAll()
    res.send({ requests: [...requests, ...suggestions] })
  } catch(err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  const userId = req.user.id
  const { request, type } = req.body
  request.user_id = userId

  try {
    const dbCtrl = db[type]
    if (!dbCtrl) throw { msg: 'invalidOp' }

    const requestRes = await dbCtrl.insert(request)
    res.send({ request: requestRes })
  } catch(err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  const { request, type } = req.body
  try {
    const dbCtrl = db[type]
    if (!dbCtrl) throw { msg: 'invalidOp' }

    const requestRes = await dbCtrl.update(request)
    res.send({ request: requestRes })
  } catch(err) {
    next(err)
  }
})

router.delete('/', async (req, res, next) => {
  const { request, type } = req.body
  try {
    const dbCtrl = db[type]
    if (!dbCtrl) throw { msg: 'invalidOp' }

    await dbCtrl.delete(request.id)
    res.send({ success: true })
  } catch(err) {
    next(err)
  }
})

module.exports = router