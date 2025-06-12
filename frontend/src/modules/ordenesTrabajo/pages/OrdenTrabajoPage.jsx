import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordenService } from '../services/ordenService';

export default function OrdenTrabajoPage() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const cargar = () => {
    setLoading(true);
    return ordenService
      .list()
      .then(setOrdenes)
      .catch((error) => {
        console.error('Error loading orders:', error);
        setOrdenes([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = (id) => {
    if (!confirm('¿Confirmas eliminar esta orden?')) return;
    
    setLoading(true);
    ordenService
      .delete(id)
      .then(() => {
        alert('Orden eliminada exitosamente');
        cargar();
      })
      .catch((error) => {
        console.error('Error deleting order:', error);
        alert('Error al eliminar la orden');
        setLoading(false);
      });
  };

  const cambiarEstado = (id, nuevoEstado) => {
    setLoading(true);
    
    // Ensure we're sending the estado in the correct format
    const payload = { estado: nuevoEstado };
    
    ordenService
      .updateEstado(id, payload) // Send payload object instead of just the string
      .then(() => {
        alert(`Estado cambiado a: ${nuevoEstado}`);
        cargar();
      })
      .catch((error) => {
        console.error('Error updating estado:', error);
        const errorMessage = error.response?.data?.message || 'Error al cambiar el estado';
        alert(errorMessage);
        setLoading(false);
      });
  };

  const facturar = (id) => {
    setLoading(true);
    
    ordenService
      .facturar(id)
      .then((f) => {
        alert(`Factura generada: ${f.numero_factura}`);
        cargar();
      })
      .catch((error) => {
        console.error('Error generating invoice:', error);
        const errorMessage = error.response?.data?.error || 'Error al generar la factura';
        alert(errorMessage);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-center">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Órdenes de Trabajo</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/ordenes-trabajo/nueva')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Puntual
          </button>
          <button
            onClick={() => navigate('/servicios-periodicos/nuevo')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Periódico
          </button>
        </div>
      </header>

      {ordenes.length ? (
        ordenes.map((o) => (
          <article key={o.id_orden} className="border p-4 mb-4 rounded shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="mb-2">
                  <strong>Cliente:</strong> {o.cliente?.razon_social || 'N/A'}
                </p>
                <p className="mb-2">
                  <strong>Dirección:</strong> {o.ubicacion?.direccion || 'N/A'}
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong>Fecha:</strong> {o.fecha_programada} – {o.hora_programada}
                </p>
                <p className="mb-2">
                  <strong>Estado:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    o.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                    o.estado === 'Cancelado' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {o.estado}
                  </span>
                </p>
              </div>
            </div>

            {/* Services details if available */}
            {o.detalles && o.detalles.length > 0 && (
              <div className="mb-4">
                <strong>Servicios:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  {o.detalles.map((detalle, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {detalle.servicio?.nombre || 'Servicio'} - {detalle.horas_realizadas} horas
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {o.estado !== 'Completado' && o.estado !== 'Cancelado' && (
                <>
                  <button
                    onClick={() => cambiarEstado(o.id_orden, 'Completado')}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    Completar
                  </button>
                </>
              )}
              
              {o.estado === 'Completado' && !o.id_factura && (
                <button
                  onClick={() => facturar(o.id_orden)}
                  className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm"
                >
                  Facturar
                </button>
              )}

              {o.estado !== 'Cancelado' && (
                <button
                  onClick={() => cambiarEstado(o.id_orden, 'Cancelado')}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  Cancelar
                </button>
              )}

              <button
                onClick={() => eliminar(o.id_orden)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Eliminar
              </button>
            </div>

            {/* Show invoice info if available */}
            {o.id_factura && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700">
                  <strong>Facturado:</strong> Factura #{o.numero_factura || o.id_factura}
                </p>
              </div>
            )}
          </article>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No hay órdenes disponibles.</p>
          <button
            onClick={() => navigate('/ordenes-trabajo/nueva')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear primera orden
          </button>
        </div>
      )}
    </div>
  );
}