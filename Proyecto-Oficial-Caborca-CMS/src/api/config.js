import axios from 'axios';

/**
 * URL base de la API del CMS.
 * - En desarrollo usa el backend local.
 * - En producción usa la URL definida por entorno.
 */
export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "https://localhost:7020/api" : "https://api.tusitio.com/api");

// Extraer la base del API eliminando el segmento '/api' al final
export const BASE_SERVER_URL = API_URL.replace(/\/api$/, '');

/**
 * Resuelve la URL completa de una imagen para previsualización.
 */
export const getImageUrl = (url) => {
    if (!url) return 'https://blocks.astratic.com/img/general-img-landscape.png';
    if (url.startsWith('/uploads')) {
        return `${BASE_SERVER_URL}${url}`;
    }
    return url;
};


/**
 * Cliente HTTP central para todo el frontend CMS.
 * Mantiene headers comunes e interceptores de autenticación.
 */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Recupera el token JWT persistido por el login.
 * @returns {string|null}
 */
const getStoredToken = () => localStorage.getItem('adminToken');

// Interceptor de request: inyecta el Bearer token si existe sesión activa.
api.interceptors.request.use(
    (config) => {
        const token = getStoredToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de response: ante 401 limpia sesión y redirige a login.
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Si el backend responde que no estamos autorizados (401), el token expiró o es inválido
            console.warn("Sesión expirada o token inválido. Redirigiendo al login...");
            localStorage.removeItem('adminToken'); // Limpiamos el token viejo
            // Opcional: Redirigir al login, dependiendo de tu enrutador (React Router)
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
