import axios from '../../../services/axios';

const BASE = '/ordenes-trabajo';
const CLIENTES = '/clientes';
const SERVICIOS = '/servicios';

export const ordenService = {
  // ─────────────── Órdenes de trabajo ───────────────
  list: () =>
    axios.get(BASE).then(res => res.data.data),

  create: (payload) =>
    axios.post(BASE, payload).then(res => res.data.data),

  delete: (id) =>
    axios.delete(`${BASE}/${id}`).then(res => res.data.data),

  /**
   * Actualiza el estado de una orden.
   * @param {number|string} id - ID de la orden a actualizar.
   * @param {{ estado: string }} payload - Objeto con la propiedad 'estado'.
   */
  updateEstado: (id, payload) =>
    axios.patch(`${BASE}/${id}/estado`, payload).then(res => res.data.data),

  facturar: (id) =>
    axios.post(`${BASE}/${id}/facturar`).then(res => res.data.data),

  // ─────────────── Catálogos auxiliares ───────────────
  listClientes: () =>
    axios.get(CLIENTES).then(res => res.data.data),

  // FIX: Asegúrate de extraer el array de la propiedad 'data', igual que con los clientes.
  listServicios: () =>
    axios.get(SERVICIOS).then(res => res.data),

  // ────── Ubicaciones por cliente (respuesta plana) ──────
  listUbicaciones: (clienteId, config = {}) =>
    axios.get(`${CLIENTES}/${clienteId}/ubicaciones`, config).then(res => res.data),
};
