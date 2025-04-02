// src/services/api.js

// 1. Importa la instancia configurada de Axios
import axiosInstance from './axios';

// =============================================
// Funciones de Autenticación
// =============================================

/**
 * Realiza la petición de login al backend.
 * @param {object} credentials - Objeto con { nombre_usuario, password }.
 * @returns {Promise<{message: string, token: string, user: object}>} Respuesta del backend con token y datos de usuario.
 */
export const loginUser = async (credentials) => {
    // El try/catch principal está en AuthContext para manejar el estado global,
    // pero podemos añadir uno aquí para logging específico si queremos.
    try {
        const response = await axiosInstance.post('/login', credentials);
        return response.data; // Devuelve { message, token, user }
    } catch (error) {
         console.error('Error específico en loginUser API call:', error.response?.data || error.message);
         throw error; // Re-lanza para que AuthContext lo maneje
    }
};

/**
 * Obtiene los datos del usuario autenticado actualmente.
 * @returns {Promise<object>} Los datos del usuario desde la API.
 */
export const fetchUserProfile = async () => {
    try {
        const response = await axiosInstance.get('/user');
        return response.data;
    } catch(error) {
         console.error('Error fetching user profile:', error.response?.data || error.message);
         throw error;
    }
};

/**
 * Realiza la petición de logout al backend.
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
    try {
        await axiosInstance.post('/logout');
    } catch(error) {
         console.error('Error en logout API call:', error.response?.data || error.message);
         throw error; // Podrías decidir no lanzar aquí si el logout del frontend es suficiente
    }
};


// =============================================
// Funciones para Órdenes de Trabajo (CRUD)
// =============================================

/**
 * Obtiene una lista paginada de órdenes de trabajo.
 * @param {object} params - Parámetros de query (ej. { page: 1, per_page: 15, estado: 'Pendiente', sort: 'campo:direccion' })
 * @returns {Promise<object>} La respuesta paginada de Laravel (data, links, meta)
 */
export const getOrdenesTrabajo = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/ordenes-trabajo', { params });
    // La respuesta paginada de Laravel Resource Collection ya tiene el formato correcto
    return response.data;
  } catch (error) {
    console.error('Error fetching órdenes de trabajo:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene una orden de trabajo específica por su ID.
 * @param {number|string} id El ID de la orden de trabajo.
 * @returns {Promise<object>} El objeto de la orden de trabajo (contenido en 'data').
 */
export const getOrdenTrabajoById = async (id) => {
  if (!id) throw new Error('Se requiere un ID para obtener la orden de trabajo.');
  try {
    const response = await axiosInstance.get(`/ordenes-trabajo/${id}`);
    return response.data.data; // Laravel API Resource envuelve el objeto individual en 'data'
  } catch (error) {
    console.error(`Error fetching orden de trabajo con ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Crea una nueva orden de trabajo.
 * @param {object} ordenData - Los datos de la orden a crear (incluyendo 'detalles').
 * @returns {Promise<{message: string, data: object}>} Objeto con mensaje y datos de la orden creada.
 */
export const createOrdenTrabajo = async (ordenData) => {
  try {
    const response = await axiosInstance.post('/ordenes-trabajo', ordenData);
    return response.data; // { message, data }
  } catch (error) {
    console.error('Error creando orden de trabajo:', error.response?.data || error.message);
    // Manejo específico de errores de validación (422)
     if (error.response?.status === 422) {
        throw { status: 422, errors: error.response.data.errors, message: error.response.data.message || 'Error de validación' };
     }
    throw error; // Lanza otros errores
  }
};

/**
 * Actualiza una orden de trabajo existente.
 * @param {number|string} id - El ID de la orden a actualizar.
 * @param {object} ordenData - Los datos a actualizar.
 * @returns {Promise<{message: string, data: object}>} Objeto con mensaje y datos de la orden actualizada.
 */
export const updateOrdenTrabajo = async (id, ordenData) => {
   if (!id) throw new Error('Se requiere un ID para actualizar la orden de trabajo.');
  try {
    const response = await axiosInstance.put(`/ordenes-trabajo/${id}`, ordenData); // O PATCH si prefieres
    return response.data; // { message, data }
  } catch (error) {
    console.error(`Error actualizando orden de trabajo ${id}:`, error.response?.data || error.message);
     if (error.response?.status === 422) {
        throw { status: 422, errors: error.response.data.errors, message: error.response.data.message || 'Error de validación' };
     }
    throw error;
  }
};

/**
 * Elimina una orden de trabajo.
 * @param {number|string} id - El ID de la orden a eliminar.
 * @returns {Promise<{message: string}>} Objeto con mensaje de éxito.
 */
export const deleteOrdenTrabajo = async (id) => {
   if (!id) throw new Error('Se requiere un ID para eliminar la orden de trabajo.');
  try {
    const response = await axiosInstance.delete(`/ordenes-trabajo/${id}`);
    return response.data; // { message }
  } catch (error) {
    console.error(`Error eliminando orden de trabajo ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// =============================================
// Funciones para Servicios (CRUD)
// =============================================

/**
 * Obtiene una lista de servicios (paginada o todos).
 * @param {object} params - Parámetros de query (ej. { page: 1, per_page: 15, all: true, activo: true })
 * @returns {Promise<object>} Respuesta paginada o array de servicios (envuelto en 'data' por Resource Collection).
 */
export const getServicios = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/servicios', { params });
        // Devuelve la respuesta completa (puede ser paginada o una colección simple)
        // El componente que llama accederá a response.data para la lista/objetos
        return response.data;
    } catch (error) {
        console.error('Error fetching servicios:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Obtiene un servicio específico por su ID.
 * @param {number|string} id El ID del servicio.
 * @returns {Promise<object>} El objeto del servicio (contenido en 'data').
 */
export const getServicioById = async (id) => {
  if (!id) throw new Error('Se requiere un ID para obtener el servicio.');
  try {
    const response = await axiosInstance.get(`/servicios/${id}`);
    return response.data.data; // Resource envuelve en 'data'
  } catch (error) {
    console.error(`Error fetching servicio con ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Crea un nuevo servicio.
 * @param {object} servicioData - Los datos del servicio a crear.
 * @returns {Promise<{message: string, data: object}>} Objeto con mensaje y datos del servicio creado.
 */
export const createServicio = async (servicioData) => {
  try {
    const response = await axiosInstance.post('/servicios', servicioData);
    return response.data; // { message, data }
  } catch (error) {
    console.error('Error creando servicio:', error.response?.data || error.message);
     if (error.response?.status === 422) {
        throw { status: 422, errors: error.response.data.errors, message: error.response.data.message || 'Error de validación' };
     }
    throw error;
  }
};

/**
 * Actualiza un servicio existente.
 * @param {number|string} id - El ID del servicio a actualizar.
 * @param {object} servicioData - Los datos a actualizar.
 * @returns {Promise<{message: string, data: object}>} Objeto con mensaje y datos del servicio actualizado.
 */
export const updateServicio = async (id, servicioData) => {
   if (!id) throw new Error('Se requiere un ID para actualizar el servicio.');
  try {
    const response = await axiosInstance.put(`/servicios/${id}`, servicioData); // O PATCH
    return response.data; // { message, data }
  } catch (error) {
    console.error(`Error actualizando servicio ${id}:`, error.response?.data || error.message);
     if (error.response?.status === 422) {
        throw { status: 422, errors: error.response.data.errors, message: error.response.data.message || 'Error de validación' };
     }
    throw error;
  }
};

/**
 * Elimina un servicio.
 * @param {number|string} id - El ID del servicio a eliminar.
 * @returns {Promise<{message: string}>} Objeto con mensaje de éxito.
 */
export const deleteServicio = async (id) => {
   if (!id) throw new Error('Se requiere un ID para eliminar el servicio.');
  try {
    const response = await axiosInstance.delete(`/servicios/${id}`);
    return response.data; // { message }
  } catch (error) {
    console.error(`Error eliminando servicio ${id}:`, error.response?.data || error.message);
    // Podrías manejar el error 409 (Conflict) aquí si el backend lo devuelve
    if (error.response?.status === 409) {
        throw { status: 409, message: error.response.data.message || 'No se puede eliminar porque está en uso.' };
    }
    throw error;
  }
};


// =============================================
// Otras Funciones API (Ejemplos)
// =============================================

/**
 * Obtiene una lista simplificada de clientes (id, nombre).
 * @returns {Promise<Array<{id_cliente: number, nombre: string}>>}
 */
export const getClientesSimple = async () => {
     try {
        // Asume endpoint /api/clientes?simple=true
        const response = await axiosInstance.get('/clientes?simple=true');
        return response.data.data; // Devuelve array [ {id_cliente, nombre}, ... ]
    } catch (error) {
        console.error('Error fetching clientes simple list:', error.response?.data || error.message);
        throw error;
    }
}

// Añade funciones para Empleados, Ubicaciones, etc., según las necesites...