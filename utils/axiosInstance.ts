
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const createUser = async (user: any) => {
  const response = await axiosInstance.post('/users', user);
  return response.data;
};

axiosInstance.interceptors.request.use(
  config => {
    if (typeof document !== 'undefined') {
      const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('session='));
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/portal/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
