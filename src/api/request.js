import { axios } from './core'

/**
 * 首页展示
 * @method getSleepDetail
 * @param {} parameter
 */
export function getSleepDetail (parameter) {
  return axios({
    url: '/api/user.user_sleep/show',
    method: 'get',
    params: parameter
  })
}

/**
 * 开始打卡
 * @method punchStart
 * @param {} parameter
 */
export function punchStart (parameter) {
  return axios({
    url: '/api/user.user_sleep/start',
    method: 'post',
    params: parameter
  })
}

/**
 * 结束打卡
 * @method punchEnd
 * @param {} parameter
 */
export function punchEnd (parameter) {
  return axios({
    url: '/api/user.user_sleep/end',
    method: 'post',
    params: parameter
  })
}

/**
 * 打卡记录
 * @method getRecordList
 * @param {} parameter
 */
export function getRecordList (parameter) {
  return axios({
    url: '/api/user.user_sleep/records',
    method: 'post',
    params: parameter
  })
}

/**
 * 获取规则
 * @method getActivityRule
 * @param {} parameter
 */
export function getActivityRule (parameter) {
  return axios({
    url: '/api/user.user_sleep/activityRule',
    method: 'post',
    params: parameter
  })
}

/**
 * 收集颜值
 * @method getYanzhi
 * @param {} parameter
 */
export function getYanzhi (parameter) {
  return axios({
    url: '/api/user.user_sleep/gain',
    method: 'post',
    params: parameter
  })
}

/**
 *
 * @method getCardList
 * @param {} parameter
 */
export function getCardList (parameter) {
  return axios({
    url: '/api/user.card/index',
    method: 'get',
    params: parameter
  })
}
/**
 *
 * @method getCardDetail
 * @param {} parameter
 */
export function getCardDetail (parameter) {
  return axios({
    url: '/api/user.card/detail',
    method: 'get',
    params: parameter
  })
}
/**
 *
 * @method receiveCard
 * @param {} parameter
 */
export function receiveCard (parameter) {
  return axios({
    url: '/api/user.card/receive',
    method: 'post',
    params: parameter
  })
}