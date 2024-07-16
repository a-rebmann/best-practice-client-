import axios from 'axios'
const baseUrl = 'http://localhost:8000/api/constraints'

const getAll = () => {
  return axios.get(baseUrl)
}

const getForProcess = (log) => {
  console.log("Log", log)
  const config = { headers: {'Content-Type': "text/plain"} };
  return axios.post(`${baseUrl}/log/`, log, config)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update, 
  getForProcess: getForProcess
}