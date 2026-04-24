import api from './config';

/**
 * Servicio de Home del CMS.
 * Centraliza lecturas/escrituras de la página Inicio y su publicación.
 */
const homeService = {
    /**
     * Obtiene el contenido actual de Home (borrador/publicado según backend).
     * @returns {Promise<object>}
     */
    getHomeContent: async () => {
        try {
            const response = await api.get('/Home');
            return response.data;
        } catch (error) {
            console.error('Error fetching home content:', error);
            throw error;
        }
    },

    /**
     * Actualiza el contenido de Home.
     * Sanitiza imágenes base64 para evitar payloads excesivos en base de datos.
     * @param {object} data
     * @returns {Promise<object>}
     */
    updateHomeContent: async (data) => {
        try {
            const stringified = JSON.stringify(data);
            const cleanString = stringified.replace(/"data:image\/[^;]+;base64,[a-zA-Z0-9\+/=]+"/g, '"https://blocks.astratic.com/img/general-img-landscape.png"');
            const cleanData = JSON.parse(cleanString);

            const response = await api.put('/Home', cleanData);
            return response.data;
        } catch (error) {
            console.error('Error updating home content:', error);
            throw error;
        }
    },

    /**
     * Sube una imagen al backend y devuelve su URL pública.
     * @param {File} file
     * @returns {Promise<string>}
     */
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Nota: Axios calcula automáticamente el Boundary para multipart/form-data
            // si le pasas un FormData, pero especificar el header ayuda a ser explícitos.
            const response = await api.post('/Upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.url; // Devuelve la URL relativa (ej: /uploads/foto.jpg)
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    },

    /**
     * Publica el contenido de Home desde borrador hacia producción.
     * @returns {Promise<object>}
     */
    deployContent: async () => {
        try {
            const response = await api.post('/Home/deploy');
            return response.data;
        } catch (error) {
            console.error('Error deploying content:', error);
            throw error;
        }
    }
};

export default homeService;