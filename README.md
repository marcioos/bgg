# BGG API axios client

Fork of [bgg](https://www.npmjs.com/package/bgg). Originally developed by [~monteslu](https://www.npmjs.com/~monteslu).

A promises aware boardgamegeek.com API client that uses [axios](https://www.npmjs.com/package/axios)

Supports [BGG XMLAPI2](http://boardgamegeek.com/wiki/page/BGG_XML_API2)

## install

`
npm install bgg-axios
`

## Usage

```javascript
const bgg = require('bgg')

bgg('collection', { username: 'marcio_os' })
  .then(function (results) {
    console.log(results)
  })
```
