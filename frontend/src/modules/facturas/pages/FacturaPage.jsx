import React, { useEffect, useState, useCallback } from 'react';
import { facturaService } from '../services/facturaService';
import { clienteService } from '../../clientes/services/clienteService';
import Spinner from '../../../components/ui/Spinner';
import FacturaFormDialog from '../components/FacturaFormDialog';
import { FacturaActions } from '../components/FacturaActions';

export default function FacturaPage() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [dialog, setDialog] = useState({ open: false, data: null, type: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const normalize = (f) => ({
    ...f,
    total_factura: parseFloat(f.total_factura) || 0,
    importe_pagado: parseFloat(f.importe_pagado) || 0,
    anulada: Boolean(f.anulada),
    estado_pago: f.estado_pago || 'pendiente',
  });


  const loadFacturas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await facturaService.list();
      setFacturas(data.map(normalize));
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar las facturas.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadClientes = useCallback(async () => {
    try {
      const data = await clienteService.list();
      setClientes(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadFacturas();
    loadClientes();
  }, [loadFacturas, loadClientes]);

  const openDialog = (data, type) =>
    setDialog({ open: true, data, type });
  const closeDialog = () =>
    setDialog({ open: false, data: null, type: null });

  const saveFactura = async (data) => {
    setError('');
    try {
      if (dialog.type === 'rectify') {
        await facturaService.anular(data.id_factura);
        const nueva = { ...data, id_factura: null, anulada: false };
        await facturaService.create(nueva);
      } else if (dialog.type === 'duplicate') {
        const duplicada = { ...data, id_factura: null, anulada: false };
        await facturaService.create(duplicada);
      }
      closeDialog();
      await loadFacturas();
    } catch (e) {
      console.error(e);
      setError('Error al guardar la factura.');
    }
  };

  const acciones = {
    onRectify: (f) => openDialog(f, 'rectify'),
    onDuplicate: (f) => openDialog(f, 'duplicate'),
    onAnular: async (f) => {
      if (!confirm('¿Anular esta factura?')) return;
      try {
        await facturaService.anular(f.id_factura);
        await loadFacturas();
      } catch {
        setError('Error al anular.');
      }
    }
    ,
    onDownload: async (id) => {
      try {
        await facturaService.descargar(id);
      } catch {
        setError('Error al descargar PDF.');
      }
    },
    onExportJSON: async (id) => {
      try {
        const { archivo } = await facturaService.exportarJSON(id);
        window.open(archivo, '_blank');
      } catch {
        setError('Error al exportar JSON.');
      }
    },
    onPay: async (f) => {
      if (f.anulada) return setError('No se puede pagar una factura anulada.');
      const monto = prompt(`Introduce el importe a pagar.\nTotal: ${f.total_factura} €\nPagado: ${f.importe_pagado} €`);
      if (monto == null) return;
      try {
        await facturaService.pagar(f.id_factura, {
          monto: parseFloat(monto),
          fecha: new Date().toISOString(),
          metodo: 'manual',
        });
        await loadFacturas();
      } catch {
        setError('Error al registrar el pago.');
      }
    },
  };

  return (
    
    <section className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Facturas</h1>
      {error && <div className="text-red-600">{error}</div>}

      <div className="relative overflow-visible bg-white rounded shadow">
        {loading ? (
          <div className="flex justify-center p-6"><Spinner /></div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Nº</th>
                <th className="p-3">Cliente</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3">Emisión</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Pagado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.length ? (
                facturas.map((f) => (
                  <tr
                    key={f.id_factura}
                    className={`border-t transition-colors ${f.anulada ? 'bg-red-50 text-gray-500 line-through' : 'hover:bg-gray-50'}`}
                  >
                    <td className="p-3 font-mono">
                      {f.numero_factura}
                      {f.id_factura_rectificada && (
                        <div className="text-xs text-gray-500">Rectifica a #{f.id_factura_rectificada}</div>
                      )}
                    </td>
                    <td className="p-3">{f.cliente?.razon_social}</td>
                    <td className="p-3 text-right">{f.total_factura.toFixed(2)} €</td>
                    <td className="p-3">{new Date(f.fecha_emision).toLocaleDateString('es-ES')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded font-semibold
                        ${f.estado_pago === 'pagado' ? 'bg-green-100 text-green-800'
                          : f.estado_pago === 'parcial' ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'}`}>
                        {(f.estado_pago || 'desconocido').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">{f.importe_pagado.toFixed(2)} €</td>
                    <td className="p-3 text-center">
                      <FacturaActions factura={f} {...acciones} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">No hay facturas</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {dialog.open && (
        <FacturaFormDialog
          open={dialog.open}
          onClose={closeDialog}
          data={dialog.data}
          clientes={clientes}
          onSave={saveFactura}
          type={dialog.type}
        />
      )}
    </section>
  );
}
