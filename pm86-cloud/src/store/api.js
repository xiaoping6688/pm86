
const isProd = process.env.NODE_ENV === 'production'

let config = {
  host: "http://127.0.0.1",
  port: "3000"
}
if (isProd) {
  config = {
    host: "http://pm86.geeklabs.vc",
    port: "3000"
  }
}
const base_url = config.host + ':' + config.port + '/api';

const axios = require('axios').create({
  baseURL: base_url,
  timeout: 10000,
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  transformResponse: [function (data) {
    console.log(data);
    return JSON.parse(data);
  }],
});

// 获取数据
export const fetchBuckets = () => {
  return axios({method: 'get', url: '/v1/buckets/'})
}

export const addBucket = (data) => {
  return axios({method: 'post', url: '/v1/bucket/create', data: data})
}

export const login = (data) => {
  return axios({method: 'post', url: '/v1/user/login', data: data})
}

export const register = (data) => {
  return axios({method: 'post', url: '/v1/user/register', data: data})
}

export const logout = (data) => {
  return axios({method: 'post', url: '/v1/user/logout', data: data})
}


