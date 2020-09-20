const Request = require('../models').request

const getAll = (opts = {}) => {
	return Request.findAll(opts)
}

const getOne = (criteria) => {
	const options = {
		where: criteria
	}
	return Request.findOne(options)
}

const getById = (requestId) => {
	const criteria = { id: requestId }
	return getOne(criteria)
}

const getByUserId = (userId) => {
	const options = {
		where: { user_id: userId }
	}
	return getAll(options)
}

const insert = (request) => {
	return Request
		.create(request)
		.then(request => getById(request.id))
}

const update = (request) => {
	const options = {
		where: { id: request.id }
	}
  return Request.update(request, options)
    .then(() => getById(request.id))
}

const _delete = (requestId) => {
	const options = {
		where: { id: requestId }
	}
	return Request.destroy(options)
	  .then(() => ({ id: requestId }))
}

module.exports = {
	getAll,
	getOne,
	getById,
	getByUserId,
	insert,
	update,
	delete: _delete
}