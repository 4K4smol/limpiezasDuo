import axios from "../../../services/axios";

const BASE = "/servicios-periodicos";

export const servicioPeriodicoService = {
  /**
   * Lista todos los servicios periódicos.
   * Devuelve un array de servicios.
   */
  list: () =>
    axios.get(BASE).then(res => res.data),

  /**
   * Obtiene un servicio periódico por ID.
   * @param {number} id - ID del servicio periódico.
   */
  get: (id) =>
    axios.get(`${BASE}/${id}`).then(res => res.data),

  /**
   * Crea un nuevo servicio periódico.
   * @param {object} payload - Datos del nuevo servicio.
   */
  create: (payload) =>
    axios.post(BASE, payload).then(res => res.data),

  /**
   * Actualiza un servicio periódico existente.
   * @param {number} id - ID del servicio a actualizar.
   * @param {object} payload - Nuevos datos.
   */
  update: (id, payload) =>
    axios.put(`${BASE}/${id}`, payload).then(res => res.data),

  /**
   * Elimina un servicio periódico.
   * @param {number} id - ID del servicio a eliminar.
   */
  delete: (id) =>
    axios.delete(`${BASE}/${id}`).then(res => res.data),

  /**
   * Genera órdenes para un servicio periódico existente.
   * @param {number} id - ID del contrato.
   */
  generarOrdenes: (id) =>
    axios.post(`${BASE}/${id}/generar-ordenes`).then(res => res.data),
};
