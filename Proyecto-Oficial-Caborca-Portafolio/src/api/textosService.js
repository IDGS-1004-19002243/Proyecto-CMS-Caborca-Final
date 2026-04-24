// API del Portafolio: Solo lectura (GET), sin autenticación.
import { API_URL } from './config';

/**
 * Servicio de textos dinámicos por página para el sitio público.
 */
export const textosService = {
    /**
     * Recupera contenido textual de una página del portafolio.
     * @param {string} pagina
     * @returns {Promise<object>}
     */
    getTextos: async (pagina) => {
        try {
            const response = await fetch(`${API_URL}/cms/content/${pagina}`);
            if (!response.ok) throw new Error(`Error al cargar textos de ${pagina}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching textos for ${pagina}:`, error);
            throw error;
        }
    }
};
