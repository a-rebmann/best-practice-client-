import axios from 'axios'
const baseUrl = import.meta.env.VITE_APP_BACKEND_API_URL + "/logs" || 'http://localhost:8000/api/logs'


const getAll = () => {
  return axios.get(baseUrl)
}


const getVariants = (log) => {
    return axios.post(`${baseUrl}/variants`, log)
}


export default {
    getAll: getAll,
    getVariants: getVariants
}