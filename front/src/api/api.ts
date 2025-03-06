import axios from "axios";

const api = axios.create({
  baseURL:"http://localhost:5000",
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // Obtener el token del localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Agregar el token a la cabecera
  }
  return config;
});

export default api;

