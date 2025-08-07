import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { servicioPeriodicoService } from '../services/servicioPeriodicoService';
import BotonGenerarOrdenes from '../components/BotonGenerarOrdenes';

export default function ServicioPeriodicoPage() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServicios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await servicioPeriodicoService.list();
      setServicios(data || []);
    } catch (err) {
      console.error("Error al cargar servicios periódicos:", err);
      setError("No se pudieron cargar los servicios periódicos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600 text-lg">Cargando servicios periódicos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
        <p className="text-gray-500 mt-2">Por favor, verifica tu conexión o inténtalo más tarde.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Servicios Periódicos</h1>
        <Link
          to="/servicios-periodicos/nuevo"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Nuevo Servicio Periódico
        </Link>
      </div>

      {servicios.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-xl">No hay servicios periódicos registrados.</p>
          <p className="text-gray-500 mt-2">Haz clic en "Nuevo Servicio Periódico" para empezar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periodicidad</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Activo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servicios.map(sp => (
                <tr key={sp.id_servicio_periodico}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {sp.cliente?.razon_social || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {sp.frecuencia || `${sp.periodicidad_mensual} veces/mes`}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className={sp.activo ? 'text-green-600' : 'text-red-600'}>
                      {sp.activo ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <BotonGenerarOrdenes
                      servicioId={sp.id_servicio_periodico}
                      onOrdersGenerated={fetchServicios}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
