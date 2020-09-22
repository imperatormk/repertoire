const Gig = require('../models').gig
const Song = require('../models').song
const Request = require('../models').request
const Suggestion = require('../models').suggestion

const getAll = (opts = {}) => {
	return Gig.findAll(opts)
}

const getOne = (criteria) => {
	const options = {
		where: criteria
	}
	return Gig.findOne(options)
}

const getActive = () => {
	const options = {
    limit: 1,
		order: [[ 'createdAt', 'DESC' ]],
		include: [{
			model: Song,
			as: 'songs'
		}, {
			model: Request,
			as: 'requests'
		}, {
			model: Suggestion,
			as: 'suggestions'
		}]
	}
  return getAll(options)
    .then((gigs) => {
			if (!gigs.length) return null

      const gig = gigs[0].toJSON()
			let { songs, active, requests } = gig
			
			if (!active) return null

			songs = songs.map((song) => {
				const songRequests = requests.filter(request => request.songs.includes(song.id)).map(request => ({ ...request, songs: undefined }))
				return {
					...song,
					requests: songRequests
				}
			})

			gig.songs = songs
			delete gig.requests

      return gig
    })
}

const getById = (gigId) => {
	const criteria = { id: gigId }
	return getOne(criteria)
}

const insert = (gig) => {
	return Gig
		.create(gig)
		.then(gig => getById(gig.id))
}

const update = (gig) => {
	const options = {
		where: { id: gig.id }
	}
  return Gig.update(gig, options)
    .then(() => getById(gig.id))
}

const _delete = (gigId) => {
	const options = {
		where: { id: gigId }
	}
	return Gig.destroy(options)
	  .then(() => ({ id: gigId }))
}

module.exports = {
	getAll,
  getOne,
  getActive,
	getById,
	insert,
	update,
	delete: _delete
}