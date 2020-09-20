const router = require('express').Router()
const db = require(__basedir + '/db/controllers')

router.get('/', async (req, res, next) => {
  try {
    const songs = await db.songs.getAll()
    res.send({ songs })
  } catch(err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const songId = req.params.id
    const song = await db.songs.getById(songId)
    res.send({ song })
  } catch(err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  const { song } = req.body
  try {
    const songRes = await db.songs.insert(song)
    res.send({ song: songRes })
  } catch(err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  const { song } = req.body
  try {
    const songRes = await db.songs.update(song)
    res.send({ song: songRes })
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