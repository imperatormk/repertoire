import http from './http'
import { getAuthHeaders } from './auth'

export default {
  fetchTests() {
    return getAuthHeaders()
      .then(options => http.get('/tests', options))
  }
}