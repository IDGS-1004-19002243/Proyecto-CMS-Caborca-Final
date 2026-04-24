import api from './config';

/**
 * Servicio de contenido textual CMS por página.
 * Opera sobre el endpoint genérico `/cms/content/{pagina}`.
 */
export const textosService = {
    /**
     * Obtiene contenido de una página para edición.
     * @param {string} pagina
     * @returns {Promise<object>}
     */
    getTextos: async (pagina) => {
        try {
            const response = await api.get(`/cms/content/${pagina}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching textos for ${pagina}:`, error);
            throw error;
        }
    },

    /**
     * Guarda contenido de una página en borrador.
     * Limpia accidentalmente cadenas base64 para proteger la base de datos.
     * @param {string} pagina
     * @param {object} data
     * @returns {Promise<object>}
     */
    updateTextos: async (pagina, data) => {
        try {
            // Limpieza estricta: Si por alguna razón el payload contiene una imagen en Base64 (ej. guardado accidental de estado viejo)
            // lo reemplazamos por el placeholder para evitar colapsar la Base de Datos.
            const stringified = JSON.stringify(data);
            const cleanString = stringified.replace(/"data:image\/[^;]+;base64,[a-zA-Z0-9\+/=]+"/g, '"https://blocks.astratic.com/img/general-img-landscape.png"');
            const cleanData = JSON.parse(cleanString);

            const response = await api.put(`/cms/content/${pagina}`, cleanData);
            return response.data;
        } catch (error) {
            console.error(`Error updating textos for ${pagina}:`, error);
            throw error;
        }
    },

    // Publica TODO el contenido borrador a producción
    /**
     * Publica todo el contenido de stage hacia producción.
     * @returns {Promise<object>}
     */
    deployContent: async () => {
        try {
            const response = await api.post('/cms/deploy');
            return response.data;
        } catch (error) {
            console.error('Error deploying content:', error);
            throw error;
        }
    }
};
