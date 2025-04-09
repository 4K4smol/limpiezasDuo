import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { useNavigate } from 'react-router-dom';

const OrdenTrabajoPage = () => {
  const [ordenes, setOrdenes] = useState([]);
  const navigate = useNavigate();

  const cargarOrdenes = () => {
    axios.get('/ordenes-trabajo')
      .then(res => setOrdenes(res.data.data))
      .catch(err => {
        console.error('Error cargando órdenes:', err);
        setOrdenes([]);
      });
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const eliminarOrden = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      axios.delete(`/ordenes-trabajo/${id}`)
        .then(() => {
          alert('Orden eliminada');
          cargarOrdenes();
        })
        .catch(err => console.error('Error al eliminar:', err));
    }
  };

  const cambiarEstado = (id, nuevoEstado) => {
    axios.patch(`/ordenes-trabajo/${id}/estado`, { estado: nuevoEstado })
      .then(() => {
        alert(`Estado cambiado a "${nuevoEstado}"`);
        cargarOrdenes();
      })
      .catch(err => console.error('Error al cambiar estado:', err));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Órdenes de Trabajo</h1>
        <button
          onClick={() => navigate('/ordenes-trabajo/nueva')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nueva Orden
        </button>
      </div>

      {Array.isArray(ordenes) && ordenes.length > 0 ? (
        ordenes.map(orden => (
          <div key={orden.id_orden} className="border p-4 mb-4 rounded shadow-sm">
            <p><strong>Cliente:</strong> {orden.cliente?.razon_social || 'Sin nombre'}</p>
            <p><strong>Dirección:</strong> {orden.ubicacion?.direccion || 'Sin dirección'}</p>
            <p><strong>Fecha:</strong> {orden.fecha_programada} - {orden.hora_programada}</p>
            <p><strong>Estado:</strong> {orden.estado}</p>

            <div className="mt-3 flex gap-2 flex-wrap">
              <button
                onClick={() => cambiarEstado(orden.id_orden, 'Completado')}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Marcar como Completado
              </button>
              <button
                onClick={() => cambiarEstado(orden.id_orden, 'Cancelado')}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Cancelar Orden
              </button>
              <button
                onClick={() => eliminarOrden(orden.id_orden)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No hay órdenes disponibles.</p>
      )}
    </div>
  );
};

export default OrdenTrabajoPage;
