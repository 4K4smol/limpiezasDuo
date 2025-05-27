import React, { useState, useEffect } from 'react';
import { getOrdenesTrabajo } from '../../services/api';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  PlusCircleIcon, 
  WrenchScrewdriverIcon, 
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

// Componente de Calendario
function CalendarioOrdenes({ ordenes, isLoading }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Obtener primer día del mes y días en el mes
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Crear array de días para mostrar en el calendario
  const calendarDays = [];
  
  // Días vacíos al inicio
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Función para obtener órdenes de un día específico
  const getOrdenesForDate = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return ordenes.filter(orden => orden.fecha_programada === dateStr);
  };

  // Navegación del calendario
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-limpio-dark flex items-center">
            <CalendarDaysIcon className="h-6 w-6 mr-2 text-limpio-gold" />
            Calendario de Órdenes
          </h2>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-limpio-dark flex items-center">
          <CalendarDaysIcon className="h-6 w-6 mr-2 text-limpio-gold" />
          Calendario de Órdenes
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 text-limpio-dark" />
          </button>
          <span className="font-semibold text-lg px-4 text-limpio-dark">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="h-5 w-5 text-limpio-dark" />
          </button>
        </div>
      </div>

      {/* Encabezados de días */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-limpio-gray py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Días del calendario */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const ordenesDelDia = getOrdenesForDate(day);
          const isToday = day && 
            year === today.getFullYear() && 
            month === today.getMonth() && 
            day === today.getDate();
          
          return (
            <div
              key={index}
              className={`
                min-h-20 p-1 border rounded-lg cursor-pointer transition-colors
                ${day ? 'hover:bg-gray-50' : ''}
                ${isToday ? 'bg-yellow-50 border-limpio-gold' : 'border-gray-200'}
                ${selectedDate === day ? 'ring-2 ring-limpio-gold' : ''}
              `}
              onClick={() => day && setSelectedDate(selectedDate === day ? null : day)}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium ${isToday ? 'text-limpio-gold' : 'text-limpio-dark'}`}>
                    {day}
                  </div>
                  {ordenesDelDia.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {ordenesDelDia.slice(0, 2).map(orden => (
                        <div
                          key={orden.id_orden}
                          className={`
                            text-xs px-1 py-0.5 rounded truncate
                            ${orden.estado === 'Programada' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}
                          `}
                          title={`${orden.cliente?.razon_social || 'N/A'} - ${orden.hora_programada ? orden.hora_programada.substring(0, 5) : 'Sin hora'}`}
                        >
                          {orden.hora_programada ? orden.hora_programada.substring(0, 5) : 'Sin hora'}
                        </div>
                      ))}
                      {ordenesDelDia.length > 2 && (
                        <div className="text-xs text-limpio-gray text-center">
                          +{ordenesDelDia.length - 2} más
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Detalles del día seleccionado */}
      {selectedDate && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2 text-limpio-dark">
            Órdenes para el {selectedDate} de {monthNames[month]}
          </h3>
          {getOrdenesForDate(selectedDate).length > 0 ? (
            <div className="space-y-2">
              {getOrdenesForDate(selectedDate).map(orden => (
                <div key={orden.id_orden} className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-limpio-dark">
                        {orden.cliente?.razon_social || 'Cliente N/A'}
                      </p>
                      <p className="text-sm text-limpio-gray">
                        {orden.ubicacion?.direccion || 'Ubicación N/A'}
                      </p>
                      <p className="text-sm text-limpio-gray">
                        Hora: {orden.hora_programada ? orden.hora_programada.substring(0, 5) : 'No especificada'}
                      </p>
                      <Link 
                        to={`/ordenes-trabajo/${orden.id_orden}`} 
                        className="text-sm text-limpio-gold hover:underline mt-1 inline-block"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                    <span className={`
                      px-2 py-1 text-xs rounded-full font-medium
                      ${orden.estado === 'Programada' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}
                    `}>
                      {orden.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-limpio-gray">No hay órdenes programadas para este día.</p>
          )}
        </div>
      )}
    </div>
  );
}

function DashboardPage() {
  const [proximasOrdenes, setProximasOrdenes] = useState([]);
  const [ordenesCompletadas, setOrdenesCompletadas] = useState([]);
  const [todasLasOrdenes, setTodasLasOrdenes] = useState([]); // Para el calendario
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Llamadas a la API usando parámetros
        const [ordenesRes, completadasRes, todasOrdenesRes] = await Promise.all([
          getOrdenesTrabajo({ estado: ['Pendiente', 'Programada'], limite: 5, sort: 'fecha_programada:asc' }),
          getOrdenesTrabajo({ estado: 'Completada', limite: 5, sort: 'updated_at:desc' }),
          getOrdenesTrabajo({ estado: ['Pendiente', 'Programada'], sort: 'fecha_programada:asc' }) // Sin límite para el calendario
        ]);

        setProximasOrdenes(ordenesRes.data || []);
        setOrdenesCompletadas(completadasRes.data || []);
        setTodasLasOrdenes(todasOrdenesRes.data || []);
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
      
      {/* Calendario - Nueva sección completa */}
      <section>
        <CalendarioOrdenes ordenes={todasLasOrdenes} isLoading={isLoading} />
      </section>

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