const base = `${import.meta.env.VITE_API_URL}/api/facturas`;

const handleResponse = async (r) => {
  if (r.ok) return r.json().then((d) => d.data ?? d);
  const contentType = r.headers.get('content-type');
  let data = {};
  if (contentType && contentType.includes('application/json')) {
    data = await r.json();
  }
  const error = new Error('Error');
  error.status = r.status;
  error.data = data;
  throw error;
};

export const facturaService = {
  list: () => fetch(base, { credentials: 'include' }).then(handleResponse),
  get: (id) => fetch(`${base}/${id}`, { credentials: 'include' }).then(handleResponse),
  create: (data) =>
    fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }).then(handleResponse),
  update: (id, data) =>
    fetch(`${base}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }).then(handleResponse),
  remove: (id) =>
    fetch(`${base}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then(handleResponse),

  descargar: (id_factura) =>
    fetch(`${base}/${id_factura}/descargar`, {
      method: 'GET',
      credentials: 'include',
    }).then((r) => {
      if (!r.ok) throw new Error('Error al descargar el PDF');
      return r.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura-${id_factura}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }),
};

