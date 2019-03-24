// import Vue from 'vue'
// import App from './App.vue'
// import router from './router'
// import store from './store'
// import iView from 'iview'
// import 'iview/dist/styles/iview.css';
//
// Vue.config.productionTip = false
//
// Vue.use(iView)
//
// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')


import 'element-ui/lib/theme-chalk/index.css';
import 'scss/index.scss';

import {companyRoutes, shopRoutes, systemRoutes} from '@/router';
import {formatEmptyText, getActionUrl, getStatusText} from 'utils/strUtil';
import localstorage from 'utils/localstorageUtil';

console.log(process.env)

import App from './App';
import Vue from 'vue';
import store from 'store';
import fecha from 'fecha';  //日期时间处理
import moment from 'moment';
import router from './router';
import VueJsonp from 'vue-jsonp';
import ElementUI from 'element-ui';
import {SHOPKIND} from '@/constant/constants';
import {getQueryString} from 'utils/configUtil';
import Toast from 'utils/Toast';
import {ACCOUNT_INFO} from 'constant/constants';

Vue.use(ElementUI);
Vue.use(Toast);
Vue.use(VueJsonp);
Vue.config.productionTip = true;
Vue.prototype.fecha = fecha;    //  日期格式化
Vue.prototype.moment = moment;  //日期格式化
Vue.prototype.getActionUrl = getActionUrl;
Vue.prototype.getStatusText = getStatusText;
Vue.prototype.formatEmptyText = formatEmptyText;

var startLoading = null

// Vue.prototype.openFullScreen = function(text){
//   startLoading = this.$loading({
//     lock: true,
//     text: text || '数据加载中...',
//     spinner: 'el-icon-loading',
//     background: 'rgba(0, 0, 0, 0.7)'
//   });
//   //return this.loading
// //      setTimeout(() => {
// //        loading.close();
// //      }, 2000);
// }
//
// Vue.prototype.closeFullScreen = function(){
//   startLoading && startLoading.close()
// }


// process.env.NODE_ENV !== 'development' ? Vue.config.errorHandler = errorHandler : null;
sessionStorage.setItem('isIframe', !!getQueryString('isIframe'));

let isAdd = false;
router.beforeEach(async (to, from, next) => {
    if (to.path === '/error/404') {
        location.href = process.env.VUE_APP_BM_HOST + 'bmanage/404';
        return;
    }
    if (from.name) {
        next();
        return;
    }
    let routes = [];
    await store.dispatch('fetchUserInfo');
    await store.dispatch('fetchUserRight');
    const {shopKind} = store.state.sysetymenu;
    switch (shopKind) {
        case SHOPKIND.SYSTEM:
            routes = systemRoutes;
            break;
        case SHOPKIND.COMPANY:
            routes = companyRoutes;
            break;
        case SHOPKIND.SHOP:
            routes = shopRoutes;
            break;
    }
    if (!isAdd && routes.length) {
        isAdd = true;
        router.addRoutes(routes);
        next({...to});
    } else {
        next();
    }
    // const { leftMenuDtos } = store.state.sysetymenu;
    // if (!leftMenuDtos.length) {
    //   await store.dispatch('fetchSystemMenu');
    // }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
});

window.onerror = function (error) {
    if (error.toString().includes('Uncaught SyntaxError: Unexpected token <')) {
        window.location.reload();
    }
};