import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create();

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear all auth related data
      localStorage.removeItem('token');
      localStorage.removeItem('workstatus');
      localStorage.removeItem('workTimer');
      localStorage.removeItem('lastWorkDuration');
      localStorage.removeItem('timeIntervals');
      
      // Reload the page to redirect to login
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 