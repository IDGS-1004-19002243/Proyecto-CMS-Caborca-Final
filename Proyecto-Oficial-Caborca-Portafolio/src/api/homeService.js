/**
 * SERVICIO DE CONSUMO DE DATOS - PORTAFOLIO
 * Encargado de la comunicación asíncrona con los endpoints públicos de la API.
 * Nota: Todas las peticiones aquí son de solo lectura (GET) y no requieren token JWT.
 */
import { API_URL } from './config';

/**
 * Cliente de lectura para contenido público del Portafolio.
 * Todas las operaciones son GET sin autenticación.
 */
const homeService = {
    /**
     * Recupera el contenido dinámico de la página de inicio (Hero, Secciones informativas).
     */
    getHomeContent: async () => {
        const response = await fetch(`${API_URL}/Home`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
        });
        if (!response.ok) throw new Error('Falla al sincronizar contenido de Inicio');
        return response.json();
    },

    /** Obtiene el catálogo completo de productos para caballero. */
    getCatalogoHombre: async () => {
        const response = await fetch(`${API_URL}/Settings/CatalogoHombre`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Error al recuperar catálogo de hombres');
        return response.json();
    },

    /** Obtiene el catálogo completo de productos para dama. */
    getCatalogoMujer: async () => {
        const response = await fetch(`${API_URL}/Settings/CatalogoMujer`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Error al recuperar catálogo de mujeres');
        return response.json();
    }
};

export default homeService;
