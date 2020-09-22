const router = require('express').Router()
const db = require(__basedir + '/db/controllers')

router.post('/', async (req, res, next) => {
  const userId = req.user.id
  const { request, type } = req.body
  request.user_id = userId

  try {
    const gig = await db.gigs.getActive()
    if (!gig) throw { status: 400, msg: 'invalidGig' }

    let requestRes = {}
    if (type === 'requests') {
      const songIds = request.songs || []
      if (!songIds.length) throw { status: 400, msg: 'emptyReq' }
  
      const songCheckP = songIds.map(songId => db.songs.getById(songId))
      const songs = await Promise.all(songCheckP)
      if (songs.filter(song => !song).length) throw { status: 400, msg: 'invalidSong' }
  
      songs.forEach((song) => {
        if (gig.id !== song.gig_id) throw { status: 400, msg: 'invalidSong' }
      })

      requestRes = await db.requests.insert(request)
    } else if (type === 'suggestions') {
      requestRes = await db.suggestions.insert(request)
    } else {
      throw { status: 400, msg: 'invalidOp' }
    }
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