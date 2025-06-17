import React, { useEffect, useState } from 'react';
import { facturaService } from '../services/facturaService';
import { clienteService } from '../../clientes/services/clienteService';

export default function FacturaPage() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [dialog, setDialog] = useState({ open: false, data: null });

  const normalize = (f) => ({
    ...f,
    total_factura: parseFloat(f.total_factura) || 0,
    importe_pagado: parseFloat(f.importe_pagado) || 0,
  });

  const loadFacturas = () =>
    facturaService
      .list()
      .then((data) => setFacturas(data.map(normalize)))
      .catch(console.error);

  const loadClientes = () =>
    clienteService
      .list()
      .then(setClientes)
      .catch(console.error);

  useEffect(() => {
    loadFacturas();
    loadClientes();
  }, []);

  const openNew = () => setDialog({ open: true, data: null });
  const openEdit = (f) => setDialog({ open: true, data: f });
  const closeForm = () => setDialog({ open: false, data: null });

  const saveFactura = (data) =>
    (data.id_factura
      ? facturaService.update(data.id_factura, data)
      : facturaService.create(data)
    )
      .then(() => {
        loadFacturas();
        closeForm();
      })
      .catch(console.error);

  const descargar = (id) =>
    facturaService
      .descargar(id)
      .catch((err) => {
        console.error(err);
        alert('Error al descargar el PDF.');
      });

  const exportarJSON = (id) =>
    facturaService
      .exportarJSON(id)
      .then(({ archivo }) => window.open(archivo, '_blank'))
      .catch((err) => {
        console.error(err);
        alert('Error al exportar JSON.');
      });

  const pagar = (f) => {
    if (f.anulada) return alert('No se puede pagar una factura anulada.');
    const monto = prompt(
      `Introduce el importe a pagar.\nTotal: ${f.total_factura.toFixed(2)} €\nPagado: ${f.importe_pagado.toFixed(2)} €`
    );
    if (monto == null) return;
    facturaService
      .pagar(f.id_factura, { monto: parseFloat(monto), fecha: new Date().toISOString(), metodo: 'manual' })
      .then(() => loadFacturas())
      .catch((err) => {
        console.error(err);
        alert('Error al registrar el pago.');
      });
  };

  const duplicar = (id) =>
    facturaService
      .duplicar(id)
      .then(() => loadFacturas())
      .catch((err) => {
        console.error(err);
        alert('Error al duplicar la factura.');
      });

  const anular = (id) => {
    if (!confirm('¿Seguro que deseas anular esta factura? Esta acción no se puede deshacer.')) return;
    facturaService
      .anular(id)
      .then(() => loadFacturas())
      .catch((err) => {
        console.error(err);
        alert('Error al anular la factura.');
      });
  };

  return (
    <section className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Facturas</h1>
      </header>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Número</th>
              <th className="p-3">Cliente</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3">Emisión</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Pagado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.length > 0 ? (
              facturas.map((f) => (
                <tr
                  key={f.id_factura}
                  className={`border-t hover:bg-gray-50 ${f.anulada ? 'bg-red-50 text-gray-500 line-through' : ''}`}
                >
                  <td className="p-3">
                    {f.numero_factura}
                    {f.anulada && (
                      <span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded">
                        Anulada
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {f.cliente?.razon_social || f.cliente?.nombre}
                  </td>
                  <td className="p-3 text-right">
                    {f.total_factura.toFixed(2)} €
                  </td>
                  <td className="p-3">{f.fecha_emision}</td>
                  <td className="p-3">{f.estado_pago}</td>
                  <td className="p-3 text-right">
                    {f.importe_pagado.toFixed(2)} €
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex flex-wrap justify-center gap-2 text-sm">
                      {!f.anulada && (
                        <>
                          <button
                            onClick={() => openEdit(f)}
                            className="text-green-600 hover:underline"
                            title="Editar factura"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => pagar(f)}
                            className="text-yellow-600 hover:underline"
                            title="Registrar pago"
                          >
                            💰 Pagar
                          </button>
                          <button
                            onClick={() => duplicar(f.id_factura)}
                            className="text-gray-600 hover:underline"
                            title="Duplicar factura"
                          >
                            📄 Duplicar
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => descargar(f.id_factura)}
                        className="text-blue-600 hover:underline"
                        title="Descargar PDF"
                      >
                        📥 PDF
                      </button>
                      <button
                        onClick={() => exportarJSON(f.id_factura)}
                        className="text-indigo-600 hover:underline"
                        title="Exportar JSON VeriFactu"
                      >
                        {"{"}⟩ JSON
                      </button>
                      {!f.anulada && (
                        <button
                          onClick={() => anular(f.id_factura)}
                          className="text-red-600 hover:underline"
                          title="Anular factura"
                        >
                          ❌ Anular
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No hay facturas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
