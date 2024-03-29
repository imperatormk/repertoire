const router = require('express').Router()
const db = require(__basedir + '/db/controllers')

router.get('/:id', async (req, res, next) => {
  try {
    const songId = req.params.id
    const song = await db.songs.getById(songId)
    res.send({ song })
  } catch(err) {
    next(err)
  }
})

router.delete('/', async (req, res, next) => {
  const { song } = req.body
  try {
    await db.songs.delete(song.id)
    res.send({ success: true })
  } catch(err) {
    next(err)
  }
})

module.exports = router