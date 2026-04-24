import api from './config';

/**
 * Servicio de configuración global del CMS.
 * Incluye mantenimiento, schedule de despliegue, configuración general y catálogos serializados.
 */
export const settingsService = {
    /** @returns {Promise<object>} */
    getMantenimiento: async () => {
        try {
            const response = await api.get('/Settings/Mantenimiento');
            return response.data;
        } catch (error) {
            console.error('Error fetching settings:', error);
            throw error;
        }
    },

    /**
     * @param {object} data
     * @returns {Promise<object>}
     */
    updateMantenimiento: async (data) => {
        try {
            const response = await api.put('/Settings/Mantenimiento', data);
            return response.data;
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    },

    /** @returns {Promise<object>} */
    getDeploySchedule: async () => {
        try {
            const response = await api.get('/Settings/DeploySchedule');
            return response.data;
        } catch (error) {
            console.error('Error fetching deploy schedule:', error);
            throw error;
        }
    },

    /**
     * @param {string} dateString
     * @returns {Promise<object>}
     */
    setDeploySchedule: async (dateString) => {
        try {
            const response = await api.post('/Settings/DeploySchedule', { date: dateString });
            return response.data;
        } catch (error) {
            console.error('Error setting deploy schedule:', error);
            throw error;
        }
    },

    /** @returns {Promise<object>} */
    getConfiguracionGeneral: async () => {
        try {
            const response = await api.get('/Settings/ConfiguracionGeneral');
            return response.data;
        } catch (error) {
            console.error('Error fetching general config:', error);
            throw error;
        }
    },

    /**
     * @param {object} data
     * @returns {Promise<object>}
     */
    updateConfiguracionGeneral: async (data) => {
        try {
            const response = await api.put('/Settings/ConfiguracionGeneral', data);
            return response.data;
        } catch (error) {
            console.error('Error updating general config:', error);
            throw error;
        }
    },

    /** @returns {Promise<object>} */
    getCatalogoHombre: async () => {
        try {
            const response = await api.get('/Settings/CatalogoHombre');
            return response.data;
        } catch (error) {
            console.error('Error fetching CatalogoHombre:', error);
            throw error;
        }
    },

    /**
     * @param {object} data
     * @returns {Promise<object>}
     */
    updateCatalogoHombre: async (data) => {
        try {
            const response = await api.put('/Settings/CatalogoHombre', data);
            return response.data;
        } catch (error) {
            console.error('Error updating CatalogoHombre:', error);
            throw error;
        }
    },

    /** @returns {Promise<object>} */
    getCatalogoMujer: async () => {
        try {
            const response = await api.get('/Settings/CatalogoMujer');
            return response.data;
        } catch (error) {
            console.error('Error fetching CatalogoMujer:', error);
            throw error;
        }
    },

    /**
     * @param {object} data
     * @returns {Promise<object>}
     */
    updateCatalogoMujer: async (data) => {
        try {
            const response = await api.put('/Settings/CatalogoMujer', data);
            return response.data;
        } catch (error) {
            console.error('Error updating CatalogoMujer:', error);
            throw error;
        }
    }
};
