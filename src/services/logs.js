import axios from 'axios'
const baseUrl = 'http://localhost:8000/api/logs'

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