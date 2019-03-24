import Router from 'vue-router';
import Vue from 'vue';
import company from './company';
import shop from './shop';
import system from './system';

const NotFound = file => require(['views/errors/NotFound'], file);

Vue.use(Router);

export const shopRoutes = shop;
export const companyRoutes = company;
export const systemRoutes = system;
// 公用的路由可以放在 constantRoutes 中, eg. 404, 500
export const constantRoutes = [
  { path: '/error/404', name: '404', component: NotFound }
];

export default new Router({
  mode: 'history',
  routes: constantRoutes
});
