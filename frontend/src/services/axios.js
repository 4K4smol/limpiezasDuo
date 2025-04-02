// src/services/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  }
});

// Interceptor de Solicitud
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  // console.log('Axios Interceptor Request:', config.url, 'Token:', token ? 'Sí' : 'No'); // Descomenta para debug extremo
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de Respuesta
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized (401). Logging out.");
            localStorage.removeItem('authToken');
            // Considera usar una función del AuthContext para un logout más limpio si es posible
            // en lugar de recargar toda la página, pero esto funciona como fallback.
            if (window.location.pathname !== '/login') { // Evita bucle si ya está en login
               window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Exportación por defecto (¡LA CLAVE!)
export default axiosInstance;