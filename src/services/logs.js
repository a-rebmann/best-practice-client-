import axios from 'axios'
const baseUrl = import.meta.env.VITE_APP_BACKEND_API_URL + "/logs" || 'http://localhost:8000/api/logs'


const getAll = () => {
  return axios.get(baseUrl)
}


const getVariants = (log) => {
    return axios.post(`${baseUrl}/variants`, log)
}

const uploadLog = async (log) => {
    if (!log) {
      console.log('Please select a file to upload');
      return;
    }
    const formData = new FormData();
    formData.append('file', log);
    try {
      const response = await axios.post(baseUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully');
      return response;
    } catch (error) {
      console.log(`Upload error: ${error.response?.data || error.message}`);
    }
}


export default {
    getAll: getAll,
    getVariants: getVariants,
    uploadLog: uploadLog
}