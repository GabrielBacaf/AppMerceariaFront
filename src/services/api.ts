import axios from 'axios';
import router from '../router'; // Assuming router is exported from src/router/index.ts

// Base URL configurada para o ambiente local do Laravel (ajuste caso necessário no .env)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // Importante para o Sanctum enviar os cookies CSRF
});

// Interceptor de Requisição (adicionar token, se necessário, embora Sanctum use cookies por padrão na mesma origin)
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Interceptor de Resposta para capturar erros globais (401, 419)
api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (error.response) {
      const status = error.response.status;
      
      // 401 Unauthorized ou 419 Page Expired
      if (status === 401 || status === 419) {
        // Limpar dados locais
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        
        // Redirecionar para o login
        if (router.currentRoute.value.path !== '/login') {
          router.push('/login');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
