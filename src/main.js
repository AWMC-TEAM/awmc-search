import Vue from 'vue';
import App from './App.vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import VueClipboard from 'vue-clipboard2';

Vue.use(VueClipboard);

import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
});

import remConfig from './config/remConfig';

import axios from "@api/axios"; // API接口访问
Vue.prototype.API = axios; //全局注册

Vue.config.productionTip = false;

//是移动端返回true,否则false
function isMobile () {
  return (/phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|webOS|android/i.test(navigator.userAgent));
}

if (isMobile()) {
  remConfig();
}

new Vue({
  render: h => h(App),
}).$mount('#app');
