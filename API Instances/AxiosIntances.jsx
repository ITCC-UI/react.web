import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'https://theegsd.pythonanywhere.com/api/v1/', //Base URL for the API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the authorization token
axiosInstance.interceptors.request.use(
  config => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
