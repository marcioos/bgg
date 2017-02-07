var axios = require('axios')
var parser = require('xml2json')

const REQUEST_TIMEOUT_MS = 10000
const BACKOFF_TIME_MS = 2000
const MAX_RETRIES = 10

const axiosInstance = axios.create({
  baseURL: 'https://www.boardgamegeek.com/xmlapi2/',
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Accept': 'text/xml',
    'Content-Type': 'text/xml'
  }
})

axiosInstance.interceptors.response.use(function (response) {
  return parser.toJson(response.data, { object: true })
})

function buildQueryString (parameters) {
  return Object.keys(parameters).reduce(function (prev, key) {
    let parameter = ''
    if (prev !== '?') {
      parameter += '&'
    }
    return `${prev}${parameter}${key}=${parameters[key]}`
  }, '?')
}

function doRequest (path, queryString, retries = 0) {
  return axiosInstance.get(`${path}${queryString}`)
          .then(function (response) {
            if (response.message && response.message.includes('processed')) {
              if (retries === MAX_RETRIES) {
                throw new Error('Maximum retries reached')
              }
              return new Promise(function (resolve, reject) {
                setTimeout(function () {
                  resolve(doRequest(path, queryString, ++retries))
                }, BACKOFF_TIME_MS)
              })
            }
            return response
          })
}

module.exports = function(path, parameters = {}) {
  const queryString = buildQueryString(parameters)

  return doRequest(path, queryString)
}
