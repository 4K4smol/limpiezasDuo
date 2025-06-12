import { useEffect, useRef, useState } from 'react';

const emptyForm = {
  id_cliente: '',
  forma_pago: '',
  iva_porcentaje: 21,
  retencion_porcentaje: 15,
  importe_pagado: 0,
  estado_pago: 'pendiente',
  items: [{ descripcion_concepto: '', cantidad: 1, precio_unitario: 0 }],
};

export default function FacturaForm({
  open,
  onClose,
  onSave,
  initialValues = null,
  clientes = [],
}) {
  const [form, setForm] = useState(emptyForm);
  const modalRef = useRef(null);
  const firstInput = useRef(null);

  // Inicialización
  useEffect(() => {
    if (open) {
      setForm(initialValues || emptyForm);
      setTimeout(() => firstInput.current?.focus(), 10);
    }
  }, [open, initialValues]);

  // Cierre con Escape / click fuera
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    const onClickOutside = (e) =>
      modalRef.current && !modalRef.current.contains(e.target) && onClose();
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open, onClose]);

  // Handlers
  const handleChange = ({ target: { name, value } }) =>
    setForm((f) => ({ ...f, [name]: value }));

  const handleItemChange = (idx, field, value) =>
    setForm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [field]: value };
      return { ...f, items };
    });

  const addItem = () =>
    setForm((f) => ({
      ...f,
      items: [...f.items, { descripcion_concepto: '', cantidad: 1, precio_unitario: 0 }],
    }));

  const removeItem = (idx) =>
    setForm((f) => ({
      ...f,
      items: f.items.filter((_, i) => i !== idx),
    }));

  // Cálculo de totales
  const base = form.items.reduce(
    (sum, i) => sum + i.cantidad * i.precio_unitario,
    0
  );
  const iva = base * (form.iva_porcentaje / 100);
  const ret = base * (form.retencion_porcentaje / 100);
  const total = base + iva - ret;

  // Validación simple
  const isValid =
    form.id_cliente &&
    form.estado_pago &&
    form.items.length > 0 &&
    form.items.every(
      (i) =>
        i.descripcion_concepto.trim() &&
        i.cantidad > 0 &&
        i.precio_unitario >= 0
    );

  // Envío
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return alert('Rellena todos los campos correctamente.');
    onSave({ ...form, total_factura: total, iva_importe: iva, retencion_importe: ret });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-6 w-full max-w-2xl space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {form.id_factura ? 'Editar Factura' : 'Nueva Factura'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              ref={firstInput}
              name="id_cliente"
              value={form.id_cliente}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Selecciona cliente</option>
              {clientes.map((c) => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.razon_social || c.nombre}
                </option>
              ))}
            </select>

            <input
              name="forma_pago"
              value={form.forma_pago}
              onChange={handleChange}
              placeholder="Forma de pago"
              className="border rounded px-3 py-2"
            />

            <input
              type="number"
              name="iva_porcentaje"
              value={form.iva_porcentaje}
              onChange={handleChange}
              placeholder="IVA %"
              className="border rounded px-3 py-2"
              min={0}
            />

            <input
              type="number"
              name="retencion_porcentaje"
              value={form.retencion_porcentaje}
              onChange={handleChange}
              placeholder="Retención %"
              className="border rounded px-3 py-2"
              min={0}
            />

            <input
              type="number"
              name="importe_pagado"
              value={form.importe_pagado}
              onChange={handleChange}
              placeholder="Importe pagado"
              className="border rounded px-3 py-2"
              min={0}
            />

            <select
              name="estado_pago"
              value={form.estado_pago}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            >
              <option value="pendiente">Pendiente</option>
              <option value="parcial">Parcial</option>
              <option value="pagado">Pagado</option>
            </select>
          </div>

          {/* Líneas de detalle */}
          <div className="space-y-2">
            {form.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-7 gap-2 items-center">
                <input
                  className="col-span-3 border rounded px-2 py-1"
                  value={item.descripcion_concepto}
                  onChange={(e) =>
                    handleItemChange(idx, 'descripcion_concepto', e.target.value)
                  }
                  placeholder="Descripción"
                  required
                />
                <input
                  type="number"
                  className="col-span-1 border rounded px-2 py-1"
                  value={item.cantidad}
                  onChange={(e) =>
                    handleItemChange(idx, 'cantidad', Number(e.target.value))
                  }
                  placeholder="Cant."
                  min={1}
                  required
                />
                <input
                  type="number"
                  className="col-span-1 border rounded px-2 py-1"
                  value={item.precio_unitario}
                  onChange={(e) =>
                    handleItemChange(idx, 'precio_unitario', Number(e.target.value))
                  }
                  placeholder="Precio"
                  min={0}
                  required
                />
                <span className="col-span-1 text-right text-sm">
                  {(item.cantidad * item.precio_unitario).toFixed(2)} €
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-red-600 col-span-1"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="text-sm text-blue-600 mt-2"
            >
              + Añadir concepto
            </button>
          </div>

          {/* Totales */}
          <div className="bg-gray-50 rounded p-3 mt-4 space-y-1 text-right">
            <div>
              Base imponible: <b>{base.toFixed(2)} €</b>
            </div>
            <div>
              IVA: <b>{iva.toFixed(2)} €</b>
            </div>
            <div>
              Retención: <b>{ret.toFixed(2)} €</b>
            </div>
            <div className="text-lg">
              Total factura: <b>{total.toFixed(2)} €</b>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="px-4 py-2 rounded bg-purple-600 text-white disabled:opacity-50"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
