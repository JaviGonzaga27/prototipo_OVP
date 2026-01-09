// src/utils/apiInterceptor.js
// Interceptor para detectar sesiones reemplazadas

let sessionReplacedCallback = null;

// Registrar callback para cuando se detecta una sesión reemplazada
export const onSessionReplaced = (callback) => {
    sessionReplacedCallback = callback;
};

// Wrapper para fetch que detecta sesiones reemplazadas
export const fetchWithSessionCheck = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);

        // Si la respuesta no es OK, verificar si es por sesión reemplazada
        if (!response.ok) {
            const data = await response.json();

            // Detectar si la sesión fue reemplazada
            if (response.status === 401 && data.code === "SESSION_REPLACED") {
                console.warn("⚠️ Sesión reemplazada - cerrando sesión automáticamente");
                if (sessionReplacedCallback) {
                    sessionReplacedCallback(data.message);
                }
            }

            // Crear una respuesta clonada con los datos ya parseados
            return {
                ok: false,
                status: response.status,
                statusText: response.statusText,
                json: async () => data,
            };
        }

        return response;
    } catch (error) {
        throw error;
    }
};

export default fetchWithSessionCheck;
