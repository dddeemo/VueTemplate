var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  API_BASE_URL: '"https://hometest.bojem.com"',
  API_BASE_URL_2: '"https://baojiedev3.bojem.com/"',
  WSS_URL: '"wss://hometest.bojem.com/wss"'
})
