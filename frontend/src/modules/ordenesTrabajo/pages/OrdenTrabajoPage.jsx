import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordenService } from '../services/ordenService';

function EstadoBadge({ estado }) {
  const estilos = {
    Completado: 'bg-green-100 text-green-800',
    Cancelado: 'bg-red-100 text-red-800',
    Pendiente: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`px-2 py-1 rounded text-sm font-semibold ${estilos[estado] || ''}`}>
      {estado}
    </span>
  );
}

function OrdenCard({ orden, onAccion }) {
  return (
    <div className="border p-4 mb-4 rounded shadow bg-white">
      <div className="grid md:grid-cols-2 gap-4 mb-2">
        <div>
          <p><strong>Cliente:</strong> {orden.cliente?.razon_social}</p>
          <p><strong>Dirección:</strong> {orden.ubicacion?.direccion}</p>
        </div>
        <div>
          <p><strong>Fecha:</strong> {orden.fecha_programada} – {orden.hora_programada}</p>
          <p className="flex items-center gap-2">
            <strong>Estado:</strong> <EstadoBadge estado={orden.estado} />
          </p>
        </div>
      </div>

      {orden.detalles?.length > 0 && (
        <ul className="list-disc ml-6 text-sm text-gray-600 mb-2">
          {orden.detalles.map((d, i) => (
            <li key={i}>{d.servicio?.nombre || 'Servicio'} – {d.horas_realizadas} h</li>
          ))}
        </ul>
      )}

      <div className="flex gap-2 mt-2 flex-wrap">
        {orden.estado === 'Pendiente' && (
          <button
            onClick={() => onAccion.completar(orden.id_orden)}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
          >
            Completar
          </button>
        )}
        {orden.estado === 'Completado' && !orden.id_factura && (
          <button
            onClick={() => onAccion.facturar(orden.id_orden)}
            className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm"
          >
            Facturar
          </button>
        )}
        {orden.estado !== 'Cancelado' && (
          <button
            onClick={() => onAccion.cancelar(orden.id_orden)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
          >
            Cancelar
          </button>
        )}
        <button
          onClick={() => onAccion.eliminar(orden.id_orden)}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
        >
          Eliminar
        </button>
      </div>

      {orden.id_factura && (
        <div className="mt-2 text-sm text-green-700">
          <strong>Facturado:</strong> #{orden.numero_factura || orden.id_factura}
        </div>
      )}
    </div>
  );
}

export default function OrdenTrabajoPage() {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargar = () => {
    setLoading(true);
    ordenService
      .list()
      .then(setOrdenes)
      .catch((err) => {
        console.error('Error cargando órdenes:', err);
        setOrdenes([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
  }, []);

  const acciones = {
    eliminar: (id) => {
      if (!confirm('¿Eliminar orden?')) return;
      ordenService.delete(id).then(cargar);
    },
    cancelar: (id) => {
      ordenService.updateEstado(id, { estado: 'Cancelado' }).then(cargar);
    },
    completar: (id) => {
      ordenService.updateEstado(id, { estado: 'Completado' }).then(cargar);
    },
    facturar: (id) => {
      ordenService.facturar(id)
        .then((r) => {
          alert(`Factura generada: ${r.data.numero_factura}`);
          cargar();
        })
        .catch((err) => {
          alert(err.response?.data?.error || 'Error al facturar');
        });
    },
  };

  const ordenesAgrupadas = useMemo(() => {
    const grupos = { puntuales: [] };
    for (const o of ordenes) {
      const key = o.id_servicio_periodico ?? 'puntuales';
      if (!grupos[key]) grupos[key] = [];
      grupos[key].push(o);
    }
    return grupos;
  }, [ordenes]);

  if (loading) return <p className="text-center mt-6">Cargando órdenes…</p>;

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
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

      {/* Órdenes puntuales */}
      {ordenesAgrupadas.puntuales?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Órdenes Puntuales</h2>
          {ordenesAgrupadas.puntuales.map((o) => (
            <OrdenCard key={o.id_orden} orden={o} onAccion={acciones} />
          ))}
        </section>
      )}

      {/* Órdenes periódicas agrupadas */}
      {Object.entries(ordenesAgrupadas)
        .filter(([key]) => key !== 'puntuales')
        .map(([id, grupo]) => (
          <section key={id} className="mb-8">
            <h2 className="text-lg font-semibold text-indigo-700">
              {grupo[0].servicio_periodico?.nombre || `Servicio periódico #${id}`}
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              Cliente: {grupo[0].cliente?.razon_social}
            </p>
            {grupo.map((o) => (
              <OrdenCard key={o.id_orden} orden={o} onAccion={acciones} />
            ))}
          </section>
        ))}
    </div>
  );
}
