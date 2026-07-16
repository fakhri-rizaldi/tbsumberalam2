import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://tbsumberalam2.test/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor untuk menyematkan token pada setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk menangani error respons dari server (misal 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jangan redirect jika error 401 berasal dari percobaan login
    if (error.response && error.response.status === 401 && !error.config.url.includes('login')) {
      // Token tidak valid atau kedaluwarsa, lakukan logout
      localStorage.removeItem('auth_token');
      // Redirect ke login, namun di Axios biasanya butuh pendekatan khusus, 
      // misalnya memancarkan custom event atau mengakses router.
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
