import axios from 'axios'

const request = axios.create({
    baseURL: 'http://127.0.0.1:5000/api/v1.0',
    timeout: 5000
})

request.interceptors.request.use(config => {
    return config
}, error => {
    return error
})
request.interceptors.response.use(response => {
    return response
}, error => {
    return error
})

export default request