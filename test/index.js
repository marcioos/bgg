var bgg = require('../');

bgg('collection', { username: 'marcio_os' })
  .then(function (response) { console.log('Got response: ', response) })
  .catch(function (error) { console.log('Caught error: ', error) })
