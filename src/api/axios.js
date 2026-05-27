// 引入axios
import axios from 'axios'
import { Message } from 'element-ui';

axios.defaults.withCredentials = true;

/**
 * 通用请求函数
 * @param {Object} options 详细配置项，使用方法与所有配置项说明如下：

  this.API.requestData({
    isMust: true, // 请求是否携带 token ，默认为 true ，可缺省
    showLoading: false, // 请求是否显示加载中遮罩层，默认 false ，可缺省
    method: "GET", // 请求方式，默认为 GET ，可缺省
    baseURL: "http://192.168.10.23:8082/", // 请求服务器地址 + 端口，可缺省
    subUrl: "api/repassword", // 请求接口地址，必传项
    timeout: 3000, // 请求超时时间，默认 3s ，可缺省
    data: { name: "admin", pasword: "123456" }, // 请求所携带参数，默认为空，可缺省
    success (res) {
      // 请求成功的回调
    },
    fail (error) {
      // 请求失败的回调
    }
  });

 */
export function requestData (options) {
  return new Promise((resolve, reject) => {

    if (options.showLoading) {
      store.state.loading = true;
    }

    // 包装请求头
    let headers = options.headers || {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    };

    // 请求是否携带 token
    const isMust = (options.isMust == true || options.isMust == false) ? options.isMust : true;
    if (isMust) headers.authToken = localStorage.getItem('authToken');

    // 创建请求实例
    const XHRReq = axios.create({
      headers,
      withCredentials: true,
      crossDomain: true,
      baseURL: options.baseURL || process.env.VUE_APP_LOCALTEST_URL || '/api/',
      timeout: 23000, // 请求超时时间 - 3s
    });

    // 请求拦截器
    XHRReq.interceptors.request.use((config) => {
      return config;
    }, (err) => {
      return Promise.reject(err);
    });

    // 统一格式包装请求参数
    let params = new URLSearchParams();
    for (let key in (options.data || {})) {
      params.append(key, options.data[key]);
    }

    // 发起请求
    XHRReq({
      url: options.subUrl,
      method: options.method || 'GET',
      params: options.sourceData || params,
    }).then(response => {
      if (options.showLoading) {
        store.state.loading = false;
      }
      if (response.code === 501) { // 用户类请求错误code (账号密码错误、用户锁定、token过期等)
        localStorage.removeItem('authToken');
        Message.error(response.data.msg);
        setTimeout(() => {
          window.location.reload();
          // window.__STATICVUE__.$router.replace('/login');
        }, 1000);
      } else if (response.data.code === 200) { // 请求成功 code
        options.success && options.success(response.data);
        resolve(response);
      } else { // 其他code
        Message.error((response.data && response.data.message) || ("请求出错[" + response.data.code + "]"));
      }
    }).catch(error => {
      if (options.showLoading) {
        store.state.loading = false;
      }
      options.fail && options.fail(error);
      reject(error);
    });
  });
}

export default {
  requestData
}
