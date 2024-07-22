import axios from 'axios'
const baseUrl = import.meta.env.VITE_APP_BACKEND_API_URL + "/config" || 'http://localhost:8000/api/config'


const getConfig = () => {
  return axios.get(baseUrl)
}


const setConfig = (config) => {
    return axios.post(`${baseUrl}`, config)
}


export default {
    getConfig: getConfig,
    setConfig: setConfig
}