const router = require('express').Router()
const db = require(__basedir + '/db/controllers')

router.post('/', async (req, res, next) => {
  const userId = req.user.id
  const { request, type } = req.body
  request.user_id = userId

  try {
    const dbCtrl = db[type]
    if (!dbCtrl) throw { msg: 'invalidOp' }

    const requestRes = await dbCtrl.insert(request)
    requestRes.type = type

    const io = req.app.get('socketio')
    io.emit('new-request', requestRes)

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