const base = `${import.meta.env.VITE_API_URL}/api/facturas`;

/**
 * Manejo estándar de respuestas HTTP.
 */
const handleResponse = async (response) => {
  if (response.ok) {
    const data = await response.json();
    return data.data ?? data;
  }

  const contentType = response.headers.get('content-type');
  let errorData = {};

  if (contentType?.includes('application/json')) {
    errorData = await response.json();
  }

  const error = new Error('Error en la solicitud');
  error.status = response.status;
  error.data = errorData;
  throw error;
};

/**
 * Servicio de facturación: conexión con API backend.
 */
export const facturaService = {
  /**
   * Obtiene listado de facturas.
   * @returns {Promise<Array>}
   */
  list: () =>
    fetch(base, {
      method: 'GET',
      credentials: 'include',
    }).then(handleResponse),

  /**
   * Obtiene una factura por su ID.
   * @param {number} id
   * @returns {Promise<Object>}
   */
  get: (id) =>
    fetch(`${base}/${id}`, {
      method: 'GET',
      credentials: 'include',
    }).then(handleResponse),

  /**
   * Crea una nueva factura.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: (data) =>
    fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...data,
        retencion_porcentaje: 15,
      }),
    }).then(handleResponse),

  /**
   * Actualiza una factura existente.
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: (id, data) =>
    fetch(`${base}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...data,
        retencion_porcentaje: 15,
      }),
    }).then(handleResponse),

  /**
   * Elimina (lógicamente) una factura.
   * @param {number} id
   * @returns {Promise<void>}
   */
  remove: (id) =>
    fetch(`${base}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then(handleResponse),

  /**
   * Descarga el PDF de una factura.
   * @param {number} id
   * @returns {Promise<void>}
   */
  descargar: (id) =>
    fetch(`${base}/${id}/descargar`, {
      method: 'GET',
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error('Error al descargar el PDF');
      return res.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }),

  /**
   * Exporta una factura en formato JSON legal (VeriFactu).
   * @param {number} id
   * @returns {Promise<{archivo: string}>}
   */
  exportarJSON: (id) =>
    fetch(`${base}/${id}/exportar-json`, {
      method: 'GET',
      credentials: 'include',
    }).then(handleResponse),

  /**
   * Registra un pago parcial o total.
   * @param {number} id
   * @param {{ monto: number, fecha: string, metodo: string }} data
   * @returns {Promise<Object>}
   */
  pagar: (id, data) =>
    fetch(`${base}/${id}/pagar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }).then(handleResponse),

  /**
   * Duplica una factura existente.
   * @param {number} id
   * @returns {Promise<Object>}
   */
  duplicar: (id) =>
    fetch(`${base}/${id}/duplicar`, {
      method: 'POST',
      credentials: 'include',
    }).then(handleResponse),

  /**
   * Anula una factura emitida (lógicamente).
   * @param {number} id
   * @returns {Promise<Object>}
   */
  anular: (id) =>
    fetch(`${base}/${id}/anular`, {
      method: 'PATCH',
      credentials: 'include',
    }).then(handleResponse),
};
