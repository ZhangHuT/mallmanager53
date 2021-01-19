import axios from 'axios'
const MyServerHttp = {}
MyServerHttp.install = function (Vue, options) {
  // 因为除了登录其他请求都需要进行Token的设置，代码重复了，通过axios的拦截器将其统一处理，方便管理

  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    console.log(config)
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      axios.headers = AUTH_TOKEN
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  // 添加实例方法
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  Vue.prototype.$http = axios
}
export default MyServerHttp
