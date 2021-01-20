'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_BASE_URL: '"https://hometest.bojem.com"',
  API_BASE_URL_2: '"https://baojiedev3.bojem.com/"'

})
