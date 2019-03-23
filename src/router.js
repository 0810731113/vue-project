import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const lazyloadcomponent = file => () => import('./views/lazeload/'+ file +'.vue')


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
      {
          path: '/lazyload',
          name: 'lazyload',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "lazyload" */ './views/lazeload/LazyLoad1.vue')
      },
      { path: 'lazyload', meta: { name: 'MDInfo', isMain: true }, name: '门店管理 > 门店信息', component: lazyloadcomponent('LazyLoad1') },
  ]
})
