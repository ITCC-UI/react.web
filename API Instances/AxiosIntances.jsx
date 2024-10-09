import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'https://theegsd.pythonanywhere.com/api/v1/',
});

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

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // Handle token expiration, redirect to login, etc.
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
