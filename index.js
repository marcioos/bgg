var axios = require('axios');
var parser = require('xml2json');

const axiosInstance = axios.create({
  baseURL: 'https://www.boardgamegeek.com/xmlapi2/',
  timeout: 5000,
  headers: {
    'Accept': 'text/xml',
    'Content-Type': 'text/xml'
  }
})

axiosInstance.interceptors.response.use(function (response) {
  return parser.toJson(response.data, { object: true })
})

module.exports = function(path, parameters = {}) {

  const queryString = Object.keys(parameters).reduce(function (prev, key) {
    let parameter = ''

    if (prev !== '?') {
      parameter += '&'
    }
    return `${prev}${parameter}${key}=${parameters[key]}`
  }, '?')

  return axiosInstance.get(`${path}${queryString}`)
}
