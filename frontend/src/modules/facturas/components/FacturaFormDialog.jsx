import React, { useState, useEffect } from 'react';

export default function FacturaFormDialog({ open, onClose, data, clientes, onSave, type }) {
  const [form, setForm] = useState({
    id_cliente: '',
    fecha_emision: '',
    base_imponible: 0,
    iva_porcentaje: 21.00,
    retencion_porcentaje: 0,
  });

  useEffect(() => {
    if (data) {
      setForm({
        id_cliente: data.id_cliente,
        fecha_emision: new Date().toISOString().slice(0, 10),
        base_imponible: parseFloat(data.base_imponible) || 0,
        iva_porcentaje: parseFloat(data.iva_porcentaje) || 21,
        retencion_porcentaje: parseFloat(data.retencion_porcentaje) || 0,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const iva = (form.base_imponible * form.iva_porcentaje) / 100;
    const ret = (form.base_imponible * form.retencion_porcentaje) / 100;
    const total = form.base_imponible + iva - ret;
    onSave({
      ...data,
      ...form,
      iva_importe: iva,
      retencion_importe: ret,
      total_factura: total,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">
          {type === 'rectify' ? 'Rectificar factura' : 'Duplicar factura'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Cliente</label>
            <select
              name="id_cliente"
              value={form.id_cliente}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              disabled
            >
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.razon_social}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Fecha emisión</label>
            <input
              type="date"
              name="fecha_emision"
              value={form.fecha_emision}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Base imponible (€)</label>
              <input
                type="number"
                name="base_imponible"
                value={form.base_imponible}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">IVA (%)</label>
              <input
                type="number"
                name="iva_porcentaje"
                value={form.iva_porcentaje}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Retención (%)</label>
            <input
              type="number"
              name="retencion_porcentaje"
              value={form.retencion_porcentaje}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
