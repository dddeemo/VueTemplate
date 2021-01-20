import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
Vue.use(Router)

let router = new Router({
  routes: routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
