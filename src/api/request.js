import { axios, axios2 } from './core'

/**
 * 
 * @method getWxConfig
 * @param {} parameter
 */
export function getWxConfig (parameter) {
  return axios({
    url: '/api/index.new_index/getUserTicketInfo',
    method: 'get',
    params: parameter
  })
}

/**
 * 
 * @method getLiveInfo
 * @param {} parameter
 */
export function getLiveInfo (parameter) {
  return axios2({
    url: '/api/live/h5LiveList',
    method: 'post',
    params: parameter
  })
}
