const router = require('express').Router()
const db = require(__basedir + '/db/controllers')

const { readRepertoire } = require(__basedir + '/helpers')

router.get('/active', async (req, res, next) => {
  try {
    const gig = await db.gigs.getActive()
    res.send({ gig })
  } catch(err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  const { gig } = req.body
  gig.active = true

  const songs = await readRepertoire()

  try {
    const activeGig = await db.gigs.getActive()
    if (activeGig) throw { status: 409, msg: 'alreadyActiveGig' }

    const gigRes = await db.gigs.insert(gig)
    const songsP = songs.map((song) => {
      song.gig_id = gigRes.id
      return db.songs.insert(song)
        .then(songRes => songRes.toJSON())
    })
    const songsRes = await Promise.all(songsP)
    gigRes.songs = songsRes // hmm doesn't attach

    res.send({ gig: gigRes })
  } catch(err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  const id = +req.params.id

  try {
    const activeGig = await db.gigs.getActive()
    if (!activeGig) throw { status: 400, msg: 'noActiveGig' }
    if (activeGig.id !== id) throw { status: 400, msg: 'mismatchedGig' }

    activeGig.active = false
    await db.gigs.update(activeGig)
    res.send({ success: true })
  } catch(err) {
    next(err)
  }
})

module.exports = router