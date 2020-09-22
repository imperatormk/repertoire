import axios from 'axios'
import EventBus from '@/services/event-bus'

const serverUrl = 'https://studiodoblo.de:3002/api'

const getAxiosApi = () => {
  const httpAxios = axios.create({
    baseURL: serverUrl
  })

  httpAxios.interceptors.response.use((response) => {
    if (!response.data) {
      EventBus.$emit('onApiFailed')
      return Promise.reject({ status: 'emptyResp' })
    }
    return response.data
  }, (error) => {
    EventBus.$emit('onApiFailed')
    return Promise.reject(error)
  })
  return httpAxios
}

const http = getAxiosApi()
export default http