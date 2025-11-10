import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

// Auth instance (for login/register)
export const authAxios = axios.create({
  baseURL: `${API_BASE}/v1/auth`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// General instance (for admin/users/etc.)
export const apiAxios = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Always attach latest token before every request
apiAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
