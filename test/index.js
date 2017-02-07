var bgg = require('../');

bgg('collection', { username: 'marcio_os' }).then((response) => console.log(response)).catch((error) => console.log(error));
