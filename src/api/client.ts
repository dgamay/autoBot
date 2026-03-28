// Instancia de axios configurada con la URL base del backend.
// El token JWT se inyecta automáticamente en cada petición
// desde localStorage para no repetirlo en cada llamada.

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const client = axios.create({
  baseURL: API_URL,
});

// Interceptor: adjunta el token JWT si existe antes de cada request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("autobot_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: si el backend responde 401, limpia la sesión local
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("autobot_token");
      localStorage.removeItem("autobot_usuario");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default client;