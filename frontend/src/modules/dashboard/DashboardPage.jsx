import React, { useState, useEffect } from 'react';
import { getOrdenesTrabajo } from '../../services/api';
import { ClockIcon, CheckCircleIcon, PlusCircleIcon, WrenchScrewdriverIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const [proximasOrdenes, setProximasOrdenes] = useState([]);
  const [ordenesCompletadas, setOrdenesCompletadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Llamadas a la API usando parámetros
        const [ordenesRes, completadasRes] = await Promise.all([
          getOrdenesTrabajo({ estado: ['Pendiente', 'Programada'], limite: 5, sort: 'fecha_programada:asc' }),
          getOrdenesTrabajo({ estado: 'Completada', limite: 5, sort: 'updated_at:desc' })
        ]);

        setProximasOrdenes(ordenesRes.data || []);
        setOrdenesCompletadas(completadasRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("No se pudieron cargar los datos del dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error && !isLoading) {
    return (
      <div className="p-6 text-center text-red-700 bg-red-100 rounded-lg border border-red-300">
        <h2 className="font-bold mb-2">Error al cargar</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 shadow"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-heading font-bold text-limpio-dark">Dashboard</h1>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Próximas Órdenes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-limpio-dark mb-4 flex items-center">
            <CalendarDaysIcon className="h-6 w-6 mr-2 text-limpio-gold" /> Próximas Órdenes
          </h2>
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded"></div>)}
            </div>
          ) : proximasOrdenes.length > 0 ? (
            <ul className="space-y-4">
              {proximasOrdenes.map(orden => (
                <li key={orden.id_orden} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <p className="font-semibold text-limpio-dark truncate">
                    {orden.cliente?.razon_social ?? 'Cliente N/A'}
                  </p>
                  <p className="text-sm text-limpio-gray truncate">
                    {orden.ubicacion?.direccion ?? 'Ubicación N/A'}
                  </p>
                  <p className="text-sm text-limpio-gray">
                    <span className="font-medium">Fecha:</span> {orden.fecha_programada ? new Date(orden.fecha_programada).toLocaleDateString('es-ES') : 'No prog.'} {orden.hora_programada ? `- ${orden.hora_programada.substring(0, 5)}` : ''}
                  </p>
                  <p className="text-sm font-medium capitalize" style={{ color: orden.estado === 'Programada' ? 'blue' : 'orange' }}>
                    Estado: {orden.estado}
                  </p>
                  <Link to={`/ordenes-trabajo/${orden.id_orden}`} className="text-sm text-limpio-gold hover:underline mt-1 inline-block">Ver Detalles</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-limpio-gray text-center py-4">No hay órdenes programadas.</p>
          )}
        </div>
        {/* Órdenes Completadas Recientes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-limpio-dark mb-4 flex items-center">
            <CheckCircleIcon className="h-6 w-6 mr-2 text-green-500" /> Órdenes Recientes (Completadas)
          </h2>
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded"></div>)}
            </div>
          ) : ordenesCompletadas.length > 0 ? (
            <ul className="space-y-4">
              {ordenesCompletadas.map(orden => (
                <li key={`comp-${orden.id_orden}`} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 flex items-start space-x-3">
                  <div>
                    <p className="text-sm text-limpio-dark">
                      <span className="font-semibold">{orden.cliente?.razon_social ?? 'N/A'}</span>
                    </p>
                    <p className="text-xs text-limpio-gray">
                      Completado: {orden.actualizado_en ? new Date(orden.actualizado_en).toLocaleDateString('es-ES') : 'N/A'}
                    </p>
                    <Link to={`/ordenes-trabajo/${orden.id_orden}`} className="text-sm text-limpio-gold hover:underline mt-1 inline-block">
                      Ver Detalles
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-limpio-gray text-center py-4">No hay órdenes completadas recientemente.</p>
          )}
        </div>
      </section>
      {/* Accesos Rápidos */}
      <section>
        <h2 className="text-xl font-semibold text-limpio-dark mb-4">Accesos Rápidos</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/ordenes-trabajo/nueva"
            className="inline-flex items-center bg-limpio-gold text-white font-semibold py-2 px-4 rounded-lg hover:bg-limpio-gold-dark transition duration-200 shadow"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" /> Nueva Orden
          </Link>
          <Link
            to="/servicios"
            className="inline-flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow"
          >
            <WrenchScrewdriverIcon className="h-5 w-5 mr-2" /> Gestionar Servicios
          </Link>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
