import React, { useEffect, useState } from 'react';
import { facturaService } from '../services/facturaService';
import FacturaForm from '../components/FacturaForm';

export default function FacturaPage() {
  const [facturas, setFacturas] = useState([]);
  const [dialog, setDialog] = useState({ open: false, data: null });

  const loadFacturas = () => {
    facturaService.list().then(setFacturas).catch(console.error);
  };

  useEffect(() => {
    loadFacturas();
  }, []);

  const openNew = () => setDialog({ open: true, data: null });
  const closeForm = () => setDialog({ open: false, data: null });

  const saveFactura = (data) => {
    const action = data.id_factura
      ? facturaService.update(data.id_factura, data)
      : facturaService.create(data);

    action.then(() => {
      loadFacturas();
      closeForm();
    });
  };

  const descargarFactura = (id_factura) => {
    facturaService.descargar(id_factura).catch((err) => {
      console.error('Error al descargar PDF:', err);
      alert('No se pudo descargar la factura.');
    });
  };

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
              <th className="p-3">Fecha</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.length > 0 ? (
              facturas.map((f) => (
                <tr key={f.id_factura} className="border-t hover:bg-gray-50">
                  <td className="p-3">{f.numero_factura}</td>
                  <td className="p-3">
                    {f.cliente?.razon_social || f.cliente?.nombre || f.id_cliente}
                  </td>
                  <td className="p-3 text-right">{f.total_factura.toFixed(2)} €</td>
                  <td className="p-3">{f.fecha_emision}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => descargarFactura(f.id_factura)}
                      className="text-blue-600 hover:underline"
                    >
                      Descargar PDF
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
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
      />
    </section>
  );
}
