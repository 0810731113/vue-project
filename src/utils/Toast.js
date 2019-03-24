/*
this.$toast.show({ content: 'test', type: 'warning' });
*/
import { Toast as View } from '../components';

let Toast = {};

Toast.install = (Vue, options) => {
  let ToastInstance = Vue.extend(View);
  let $vm = new ToastInstance();
  let instance = $vm.$mount().$el;
  document.body.appendChild(instance);

  Vue.prototype.$toast = {
    show (options) {
      Object.assign($vm, options);
      $vm.isShow = true;
    }
  };
};

export default Toast;

