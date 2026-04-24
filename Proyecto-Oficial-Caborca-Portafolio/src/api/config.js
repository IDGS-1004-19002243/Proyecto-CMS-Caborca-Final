/**
 * Configuracion central del cliente HTTP del Portafolio.
 *
 * Prioridad de resolucion:
 * 1) `VITE_API_URL` definido por entorno.
 * 2) URL local en desarrollo.
 * 3) Placeholder generico en produccion (debe reemplazarse en deploy).
 */
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'https://localhost:7020/api' : 'https://api.tusitio.com/api');

// Extraer la base del API eliminando el segmento '/api' al final
export const BASE_SERVER_URL = API_URL.replace(/\/api$/, '');

/**
 * Resuelve la URL completa de una imagen.
 * Si es una ruta local (/uploads), le concatena el dominio del servidor.
 * Si es una URL externa (Cloudinary/Blob), la deja intacta.
 */
export const getImageUrl = (url) => {
  if (!url) return 'https://blocks.astratic.com/img/general-img-landscape.png';
  if (url.startsWith('/uploads')) {
    return `${BASE_SERVER_URL}${url}`;
  }
  return url;
};
