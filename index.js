const axios = require('axios')
const parser = require('xml2json')

const REQUEST_TIMEOUT_MS = 10000
const BACKOFF_TIME_MS = 2000
const MAX_RETRIES = 10

const apiClient = axios.create({
  baseURL: 'https://www.boardgamegeek.com/xmlapi2/',
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Accept': 'text/xml',
    'Content-Type': 'text/xml'
  }
})

apiClient.interceptors.response.use((response) => parser.toJson(response.data, { object: true }))

function buildQueryString (parameters) {
  return Object.keys(parameters).reduce((prev, key) => {
    let parameter = ''
    if (prev !== '?') {
      parameter += '&'
    }
    return `${prev}${parameter}${key}=${parameters[key]}`
  }, '?')
}

function doApiRequest (path, queryString = '', retries = 0) {
  return apiClient
    .get(`${path}${queryString}`)
    .then((response) => {
      if (response.message && response.message.includes('processed')) {
        if (retries === MAX_RETRIES) {
          throw new Error('Maximum retries reached')
        }
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(doRequest(path, queryString, ++retries))
          }, BACKOFF_TIME_MS)
        })
      }
      return response
    })
}

const searchClient = axios.create({
  baseURL: 'https://www.boardgamegeek.com/search/',
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Accept': 'application/json, text/plain',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
})

module.exports = {
  apiRequest: (path, parameters = {}) => {
    const queryString = buildQueryString(parameters)
    return doApiRequest(path, queryString)
  },
  search: (term, maxResults = 3) => {
    const encodedTerm = encodeURI(term)
    return searchClient
      .get(`boardgame?q=${encodedTerm}&showcount=${maxResults}`)
      .then((response) => response.data)
  }
}
