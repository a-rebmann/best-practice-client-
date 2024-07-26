import axios from 'axios'
const baseUrl = import.meta.env.VITE_APP_BACKEND_API_URL + "/constraints" || 'http://localhost:8000/api/constraints'

const getAll = () => {
  return axios.get(baseUrl)
}

const getForProcess = (data) => {
  console.log(data)
  return axios.put(`${baseUrl}/log`, data)
}

const createConstraint = newConstraint => {
  return axios.post(`${baseUrl}/new`, newConstraint)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

const getModelIDsForConstraint = (constraint) => {
  return axios.get(`${baseUrl}/${constraint.id}/models`)
}

export default { 
  getAll: getAll, 
  createConstraint: createConstraint, 
  update: update, 
  getForProcess: getForProcess,
  getModelIDsForConstraint: getModelIDsForConstraint,
  baseUrl: baseUrl
}