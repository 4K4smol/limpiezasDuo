import React, { useEffect, useState } from 'react';
import { facturaService } from '../services/facturaService';
import { clienteService } from '../../clientes/services/clienteService';
import FacturaForm from '../components/FacturaForm';

export default function FacturaPage() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [dialog, setDialog] = useState({ open: false, data: null });

  // Carga y normalización de datos
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

  // Apertura/cierre del modal de formulario
  const openNew = () => setDialog({ open: true, data: null });
  const openEdit = (f) => setDialog({ open: true, data: f });
  const closeForm = () => setDialog({ open: false, data: null });

  // Crear/actualizar
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

  // Descargar PDF
  const descargar = (id) =>
    facturaService
      .descargar(id)
      .catch((err) => {
        console.error(err);
        alert('Error al descargar el PDF.');
      });

  // Exportar JSON
  const exportarJSON = (id) =>
    facturaService
      .exportarJSON(id)
      .then(({ archivo }) => window.open(`/storage/${archivo}`, '_blank'))
      .catch((err) => {
        console.error(err);
        alert('Error al exportar JSON.');
      });

  // Pagar factura
  const pagar = (id) => {
    const monto = prompt('Introduce el importe pagado:');
    if (monto == null) return;
    facturaService
      .pagar(id, { monto: parseFloat(monto), fecha: new Date().toISOString(), metodo: 'manual' })
      .then(() => loadFacturas())
      .catch((err) => {
        console.error(err);
        alert('Error al registrar el pago.');
      });
  };

  // Duplicar factura
  const duplicar = (id) =>
    facturaService
      .duplicar(id)
      .then(() => loadFacturas())
      .catch((err) => {
        console.error(err);
        alert('Error al duplicar la factura.');
      });

  return (
    <section className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Facturas</h1>
        <button
          onClick={openNew}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Nueva Factura
        </button>
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
                <tr key={f.id_factura} className="border-t hover:bg-gray-50">
                  <td className="p-3">{f.numero_factura}</td>
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
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => openEdit(f)}
                      className="text-green-600 hover:underline"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => descargar(f.id_factura)}
                      className="text-blue-600 hover:underline"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => exportarJSON(f.id_factura)}
                      className="text-indigo-600 hover:underline"
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => pagar(f.id_factura)}
                      className="text-yellow-600 hover:underline"
                    >
                      Pagar
                    </button>
                    <button
                      onClick={() => duplicar(f.id_factura)}
                      className="text-gray-600 hover:underline"
                    >
                      Duplicar
                    </button>
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

      <FacturaForm
        open={dialog.open}
        onClose={closeForm}
        onSave={saveFactura}
        initialValues={dialog.data}
        clientes={clientes}
      />
    </section>
  );
}
