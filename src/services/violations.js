import axios from 'axios'

const baseUrl = import.meta.env.VITE_APP_BACKEND_API_URL + "/violations" || 'http://localhost:8000/api/violations'


const getViolations = (selectedConstraints) => {
    return axios.post(baseUrl, selectedConstraints)
}

const getVariantsForSelection = (selectedViolations) => {
    console.log(selectedViolations)
    return axios.post(`${baseUrl}/variants`, selectedViolations)
}


export default {
    getViolations: getViolations,
    getVariantsForSelection: getVariantsForSelection
}