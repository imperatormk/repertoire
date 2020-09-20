const Suggestion = require('../models').suggestion

const getAll = (opts = {}) => {
	return Suggestion.findAll(opts)
}

const getOne = (criteria) => {
	const options = {
		where: criteria
	}
	return Suggestion.findOne(options)
}

const getById = (suggestionId) => {
	const criteria = { id: suggestionId }
	return getOne(criteria)
}

const getByUserId = (userId) => {
	const options = {
		where: { user_id: userId }
	}
	return getAll(options)
}

const insert = (suggestion) => {
	return Suggestion
		.create(suggestion)
		.then(suggestion => getById(suggestion.id))
}

const update = (suggestion) => {
	const options = {
		where: { id: suggestion.id }
	}
  return Suggestion.update(suggestion, options)
    .then(() => getById(suggestion.id))
}

const _delete = (suggestionId) => {
	const options = {
		where: { id: suggestionId }
	}
	return Suggestion.destroy(options)
	  .then(() => ({ id: suggestionId }))
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