// src/modules/servicios/services/serviciosService.js

const base = `${import.meta.env.VITE_API_URL}/api/servicios`;

/**
 * Manejo estándar de respuestas fetch.
 */
const handleResponse = async (r) => {
  if (r.ok) return r.json().then((d) => d.data ?? d);
  const contentType = r.headers.get('content-type');
  let data = {};
  if (contentType?.includes('application/json')) {
    data = await r.json();
  }
  const error = new Error('Error en la solicitud');
  error.status = r.status;
  error.data = data;
  throw error;
};

export const serviciosService = {
  /**
   * Obtiene todos los servicios raíz (con sus hijos anidados).
   */
  list: () =>
    fetch(base, { credentials: 'include' }).then(handleResponse),

  /**
   * Recupera un servicio por ID (incluye padre e hijos).
   */
  get: (id) =>
    fetch(`${base}/${id}`, { credentials: 'include' }).then(handleResponse),

  /**
   * Crea un nuevo servicio.
   */
  create: (data) =>
    fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }).then(handleResponse),

  /**
   * Actualiza un servicio existente.
   */
  update: (id, data) =>
    fetch(`${base}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }).then(handleResponse),

  /**
   * Elimina (o desactiva) un servicio.
   */
  remove: (id) =>
    fetch(`${base}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then(handleResponse),
};
