
const config = {
  host: "http://127.0.0.1",
  port: "8080"
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
  return axios({method: 'get', url: '/v1/buckets/', params: {uuid: "123"}})
}
