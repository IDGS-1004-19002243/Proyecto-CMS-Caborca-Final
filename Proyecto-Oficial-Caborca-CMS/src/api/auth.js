import { API_URL } from './config';

/**
 * SERVICIO DE SEGURIDAD Y CONTROL DE ACCESO
 * Gestiona el ciclo de vida de la sesión administrativa y la comunicación 
 * con los endpoints de identidad del Backend.
 */
export const authService = {
    /**
     * Valida las credenciales del usuario y recupera el JWT de sesión.
     * @param {string} usuario - Identificador único del administrador.
     * @param {string} password - Contraseña en texto plano (se cifra en el transporte vía HTTPS).
     * @returns {Promise<{token: string, rol: string}>} - Token de acceso y privilegios asignados.
     */
    async login(usuario, password) {
        try {
            const response = await fetch(`${API_URL}/Auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Falla en la validación de identidad');
            }

            return await response.json();
        } catch (error) {
            console.error("AuthService Exception (Login):", error);
            throw error;
        }
    },

    /**
     * Termina la sesión activa limpiando los registros de persistencia local.
     */
    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    },

    /**
     * Recupera el perfil del usuario persistido en el cliente.
     */
    getCurrentUser() {
        const userStr = localStorage.getItem('adminUser');
        if (userStr) return JSON.parse(userStr);
        return null;
    },

    /**
     * Predicado que determina si el cliente posee un token de acceso válido.
     */
    isAuthenticated() {
        return !!localStorage.getItem('adminToken');
    },

    /**
     * Recupera el listado global de cuentas administrativas.
     * Acceso restringido a nivel de API para perfiles con rol 'SuperAdmin'.
     */
    async getAdminUsers() {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/Auth/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Permisos insuficientes o falla de servidor al recuperar usuarios');
            }

            return await response.json();
        } catch (error) {
            console.error("AuthService Exception (GetUsers):", error);
            throw error;
        }
    },

    /**
     * Orquestación de cambio de credenciales. Permite la actualización propia o delegada.
     * @param {string} currentPassword - Validación de seguridad previa.
     * @param {string} newPassword - Nuevo secreto a persistir.
     * @param {string|null} targetUsername - Usuario destino (opcional, para uso de SuperAdmin).
     */
    async changePassword(currentPassword, newPassword, targetUsername = null) {
        try {
            const token = localStorage.getItem('adminToken');
            const bodyData = { currentPassword, newPassword };
            if (targetUsername) {
                bodyData.targetUsername = targetUsername;
            }

            const response = await fetch(`${API_URL}/Auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'La actualización de contraseña fue rechazada por la política de seguridad');
            }

            return await response.json();
        } catch (error) {
            console.error("AuthService Exception (PasswordUpdate):", error);
            throw error;
        }
    }
};
