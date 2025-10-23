import axios from 'axios';

const api = axios.create({
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// ensure CSRF cookie is fetched before each request
api.interceptors.request.use(async (config) => {
  // Only run if CSRF cookie is missing
  if (!document.cookie.includes('XSRF-TOKEN')) {
    await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
  }

  return config;
}, (error) => Promise.reject(error));

export default api;
