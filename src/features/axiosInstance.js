import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api',
    timeout: 10000, // Timeout after 10 seconds
    withCredentials: true, // Send cookies along with the request (if your backend requires it)
});

export default axiosInstance;
