
import config from '../../config.json'
import Vue from 'vue'
const isProd = process.env.NODE_ENV === 'production'

const currentConfig = config[isProd ? 'prod' : 'dev']
const api_version   = 'v1';

const axios = require('axios').create({
  baseURL: `${currentConfig.base_url}/${api_version}`,
  timeout: 10000,
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  transformResponse: [function (data) {
    console.log(data);
    return JSON.parse(data);
  }],
});

export const get = function (url) {
  return axios.get(url)
}

// 新建数据
export const post = function (info) {
  return axios.post(`/${info.url}`, info.data);
}

// 获取数据
export const fetchBuckets = () => {
  return axios({method: 'get', url: '/buckets'})
}

export const addBucket = (data) => {
  return axios({method: 'post', url: '/bucket/create', data: data})
}

export const login = (data) => {
  return axios({method: 'post', url: '/account/login', data: data})
}

export const register = (data) => {
  return axios({method: 'post', url: '/account/register', data: data})
}

export const logout = (data) => {
  return axios({method: 'post', url: '/account/logout', data: data})
}


