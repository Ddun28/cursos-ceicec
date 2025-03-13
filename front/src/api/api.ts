import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // Obtener el token del localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Agregar el token a la cabecera
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token no válido o expirado
      localStorage.removeItem('access_token'); // Eliminar el token inválido
      window.location.href = "/login"; // Redirigir al usuario a la página de inicio de sesión
    }
    return Promise.reject(error);
  }
);

export default api;