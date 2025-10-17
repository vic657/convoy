import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE + '/v1/auth',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const token = localStorage.getItem('auth_token');
if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;
