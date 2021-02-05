import http from './http'
import { getAuthHeaders } from './auth'

const promisedXhr = (url, {
  method, body, authToken, id
}, onProgress) => {
  const promise = (resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.addEventListener('error', () => {
      const resp = JSON.parse(xhr.responseText)
      reject(resp)
    }, false)

    xhr.onreadystatechange = e => {
      const { readyState, status } = e.currentTarget
      if (readyState === 4) {
        const resp = JSON.parse(xhr.responseText)
        if (status >= 200 && status < 400) {
          resolve(resp)
          return
        }
        reject(resp)
      }
    }
    if (onProgress) {
      const onProgressInternal = e => {
        const percentComplete = e.lengthComputable ? (e.loaded / e.total) * 100 : 0
        onProgress({ progress: Number(percentComplete.toFixed(1)), id })
      }
      xhr.upload.addEventListener('progress', onProgressInternal, false)
    }
    xhr.open(method, url, true)
    xhr.setRequestHeader('Authorization', authToken)
    xhr.send(body)
  }
  return new Promise(promise)
}

export default {
  fetchTests() {
    return getAuthHeaders()
      .then(options => http.get('/tests', options))
  },
  uploadRepertoire(repertoires, onProgress) {
    if (!repertoires) return []

    return getAuthHeaders()
      .then(options => repertoires.map(repertoire => {
        const { file, metadata } = repertoire

        const formData = new FormData()
        formData.append('repertoire', file)
        formData.append('data', JSON.stringify(metadata))

        return promisedXhr('/api/admin/repertoire', {
          method: 'POST',
          body: formData,
          id: metadata.id,
          authToken: options.headers.Authorization
        }, onProgress)
      }))
  }
}