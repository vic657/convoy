import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

// Auth instance (for login/register)
export const authAxios = axios.create({
  baseURL: `${API_BASE}/v1/auth`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// General instance (for admin/users/etc.)
export const apiAxios = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add token automatically if present
const token = localStorage.getItem('auth_token');
if (token) {
  authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  apiAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
