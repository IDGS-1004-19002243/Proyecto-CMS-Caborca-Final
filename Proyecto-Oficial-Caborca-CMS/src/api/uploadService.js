import api from './config';

/**
 * SERVICIO DE GESTIÓN DE MEDIOS
 * Procesa la carga de archivos binarios (imágenes) hacia el servicio centralizado.
 * La persistencia final la define el backend (almacenamiento local o proveedor externo).
 * 
 * @param {File} file - Objeto de archivo obtenido del input del navegador.
 * @returns {Promise<string>} - URL segura (HTTPS) de la imagen procesada.
 */
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        // Se utiliza Axios para manejar el stream multinivel (multipart/form-data)
        const response = await api.post('/Upload', formData, {
            headers: {
                'Content-Type': undefined // Permite que el navegador defina el boundary correcto
            }
        });
        
        return response.data.url;
    } catch (error) {
        console.error("UploadService Exception (Media):", error);
        throw error;
    }
};
