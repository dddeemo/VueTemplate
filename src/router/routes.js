export default [
  {
    path: '/',
    name: 'index',
    component: resolve => {
      require.ensure([], () => resolve(require('@/pages/Index/index')))
    },
    meta: {title: '', keepAlive: false}
  }
]