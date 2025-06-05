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


export const clienteService = {
  list: () =>
    fetch(base, { credentials: 'include' })
      .then(json)
      .then(r => r.data),          // ⬅️  devuelve directamente el array

  get: (id) =>
    fetch(`${base}/${id}`, { credentials: 'include' })
      .then(json)
      .then(r => r.data),          // ⬅️  idem

  create: (data) =>
    fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
      .then(json)
      .then(r => r.data),

  update: (id, data) =>
    fetch(`${base}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
      .then(json)
      .then(r => r.data),

  remove: (id) =>
    fetch(`${base}/${id}`, { method: 'DELETE', credentials: 'include' }),

  toggle: (id) =>
    fetch(`${base}/${id}/toggle-activo`, { method: 'PATCH', credentials: 'include' })
      .then(json),

  ubicaciones: (id) =>
    fetch(`${base}/${id}/ubicaciones`, { credentials: 'include' })
      .then(json),
};
