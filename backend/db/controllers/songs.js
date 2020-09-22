const Song = require('../models').song
const Request = require('../models').request
const Suggestion = require('../models').suggestion

const getAll = (opts = {}) => {
	return Song.findAll(opts)
}

const getOne = (criteria) => {
	const options = {
		where: criteria
	}
	return Song.findOne(options)
}

const getById = (songId) => {
	const criteria = { id: songId }
	return getOne(criteria)
}

const insert = (song) => {
	return Song
		.create(song)
		.then(song => getById(song.id))
}

const update = (song) => {
	const options = {
		where: { id: song.id }
	}
  return Song.update(song, options)
    .then(() => getById(song.id))
}

const _delete = (songId) => {
	const options = {
		where: { id: songId }
	}
	return Song.destroy(options)
	  .then(() => ({ id: songId }))
}

module.exports = {
	getAll,
	getOne,
	getById,
	insert,
	update,
	delete: _delete
}