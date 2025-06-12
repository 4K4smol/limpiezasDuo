const base = `${import.meta.env.VITE_API_URL}/api/facturas`;

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

/**
 * Servicio para gestión de facturas.
 */
export const facturaService = {
  /**
   * Lista todas las facturas.
   */
  list: () =>
    fetch(base, {
      method: 'GET',
      credentials: 'include',
    }).then(handleResponse),

  /**
   * Obtiene una factura por ID.
   */
  get: (id) =>
    fetch(`${base}/${id}`, {
      method: 'GET',
      credentials: 'include',
    }).then(handleResponse),

  /**
   * Crea una nueva factura. Siempre fuerza retención del 15%.
   */
  create: (data) =>
    fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...data,
        retencion_porcentaje: 15, // retención fija
      }),
    }).then(handleResponse),

  /**
   * Actualiza una factura existente.
   */
  update: (id, data) =>
    fetch(`${base}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...data,
        retencion_porcentaje: 15, // refuerzo también al editar
      }),
    }).then(handleResponse),

  /**
   * Elimina una factura (debería ser anulación lógica, no física).
   */
  remove: (id) =>
    fetch(`${base}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then(handleResponse),

  /**
   * Descarga el PDF de la factura por ID.
   */
  descargar: (id) =>
    fetch(`${base}/${id}/descargar`, {
      method: 'GET',
      credentials: 'include',
    }).then((r) => {
      if (!r.ok) throw new Error('Error al descargar el PDF');

      return r.blob().then((blob) => {
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
   * Registra un pago sobre la factura.
   */
  pagar: (id, data) =>
    fetch(`${base}/${id}/pagar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data), // { monto, fecha, metodo }
    }).then(handleResponse),

  /**
   * Duplica una factura existente.
   */
  duplicar: (id) =>
    fetch(`${base}/${id}/duplicar`, {
      method: 'POST',
      credentials: 'include',
    }).then(handleResponse),
};
