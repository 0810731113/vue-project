import Vue from 'vue'
import Router from 'vue-router'
import Layout from './views/Layout1/Layout.vue'

Vue.use(Router)

const lazyloadcomponent = file => () => import('./views/lazeload/'+ file +'.vue')

const baseRoot = '/myd'


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
        path: baseRoot + '/',
        name: 'layout',
        component: Layout,
        redirect: baseRoot + '/about',
        children:[
            {path: 'about',name: 'about',component: () => import(/* webpackChunkName: "about" */ './views/About.vue')},
            {path: 'lazyload',name: 'lazyload',component: () => import(/* webpackChunkName: "lazyload" */ './views/lazeload/LazyLoad1.vue')},
            {path: 'lazyload', meta: { name: 'MDInfo', isMain: true }, name: '门店管理 > 门店信息', component: lazyloadcomponent('LazyLoad1') },
        ]
    },
  ]
})
