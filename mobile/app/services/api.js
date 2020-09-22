import http from './http'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkYXJrby5zaW1vbm92c2tpQGhvdG1haWwuY29tIiwiaWF0IjoxNjAwNTY3MjkyfQ.VB5XGzeMpnSjWpcMxfvcsiN8Xouc-MTHQh4eLgj6Yx0'

const getAuthHeaders = (opts) => {
  const options = opts || {}
  return Promise.resolve({ token })
    .then(resp => (resp ? resp.token : ''))
    .then((token) => {
      const optionsRes = options
      optionsRes.headers = {
        Authorization: `JWT ${token}`
      }
      return optionsRes
    })
}

export default {
  getActiveGig() {
    return getAuthHeaders()
      .then(options => http.get('/gigs/active', options))
  },
  startGig(gig) {
    return getAuthHeaders()
      .then(options => http.post('/gigs', { gig }, options))
  },
  stopGig(gigId) {
    return getAuthHeaders()
      .then(options => http.put(`/gigs/${gigId}`, {}, options))
  },
  requestsSongs(gigId, songs) {
    const reqObj = {
      request: {
        gig_id: gigId,
        songs,
        message: 'Pls these ones'
      },
      type: 'requests'
    }
    return getAuthHeaders()
      .then(options => http.post('/requests', reqObj, options))
  }
}