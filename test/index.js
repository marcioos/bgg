var bgg = require('../');

bgg.apiRequest('thing', { id: '83330' })
  .then((response) => { console.log(response) })
  .catch((error) => { console.log(error) })

bgg.search('dominion')
  .then((response) => console.log(response))
  .catch((error) => console.log(error))
