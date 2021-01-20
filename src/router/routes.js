export default [
  {
    path: '/',
    name: 'index',
    component: resolve => {
      require.ensure([], () => resolve(require('@/pages/Index/index')))
    },
    meta: {title: '宝姐家拍卖', keepAlive: false}
  },
  {
    path: '/share',
    name: 'share',
    component: resolve => {
      require.ensure([], () => resolve(require('@/pages/Index/sharePage')))
    },
    meta: {title: '宝姐家直播', keepAlive: false}
  }
]