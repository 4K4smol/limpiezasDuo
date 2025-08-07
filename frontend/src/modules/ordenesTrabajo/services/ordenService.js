import axios from '../../../services/axios';

const BASE = '/ordenes-trabajo';
const CLIENTES = '/clientes';
const SERVICIOS = '/servicios';

export const ordenService = {
  list: () => axios.get(BASE).then(res => res.data.data),
  create: (payload) => axios.post(BASE, payload).then(res => res.data.data),
  delete: (id) => axios.delete(`${BASE}/${id}`).then(res => res.data.data),
  updateEstado: (id, payload) => axios.patch(`${BASE}/${id}/estado`, payload).then(res => res.data.data),
  facturar: (id) => axios.post(`${BASE}/${id}/facturar`).then(res => res.data.data),
  facturarMultiples: (ids) => axios.post(`${BASE}/facturar-multiple`, { ordenes: ids }).then(res => res.data.data),
  listClientes: () => axios.get(CLIENTES).then(res => res.data.data),
  listServicios: () => axios.get(SERVICIOS).then(res => res.data.data),
  listUbicaciones: (clienteId, config = {}) => axios.get(`${CLIENTES}/${clienteId}/ubicaciones`, config).then(res => res.data),
};
