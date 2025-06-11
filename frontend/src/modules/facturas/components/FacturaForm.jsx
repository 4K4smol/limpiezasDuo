import { useEffect, useRef, useState } from 'react';

const empty = {
  id_cliente: '',
  iva_porcentaje: 21,
  retencion_porcentaje: 0,
  forma_pago: '',
  items: [{ descripcion_concepto: '', cantidad: 1, precio_unitario: 0 }],
};

export default function FacturaForm({ open, onClose, onSave, initialValues, clientes = [] }) {
  const [form, setForm] = useState(empty);
  const modalRef = useRef(null);
  const firstInput = useRef(null);

  useEffect(() => {
    setForm(initialValues || empty);
  }, [initialValues, open]);

  useEffect(() => {
    if (open && firstInput.current) firstInput.current.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose();
    const onClickOutside = (e) => modalRef.current && !modalRef.current.contains(e.target) && onClose();
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open, onClose]);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleItemChange = (i, field, value) => {
    setForm((f) => {
      const items = [...f.items];
      items[i] = { ...items[i], [field]: value };
      return { ...f, items };
    });
  };

  const addItem = () =>
    setForm((f) => ({
      ...f,
      items: [...f.items, { descripcion_concepto: '', cantidad: 1, precio_unitario: 0 }],
    }));
  const removeItem = (i) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  // Cálculo de totales
  const base = form.items.reduce((acc, it) => acc + (Number(it.cantidad) * Number(it.precio_unitario)), 0);
  const iva = base * (Number(form.iva_porcentaje) / 100);
  const ret = base * (Number(form.retencion_porcentaje) / 100);
  const total = base + iva - ret;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div ref={modalRef} className="bg-white rounded-xl p-6 w-full max-w-2xl space-y-4">
        <h2 className="text-xl font-semibold">{form.id_factura ? 'Editar Factura' : 'Nueva Factura'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-auto" noValidate>
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
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>
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
              min="0"
            />
            <input
              type="number"
              name="retencion_porcentaje"
              value={form.retencion_porcentaje}
              onChange={handleChange}
              placeholder="Retención %"
              className="border rounded px-3 py-2"
              min="0"
            />
          </div>
          <div className="space-y-2">
            {form.items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-7 gap-2 items-center">
                <input
                  className="col-span-3 border rounded px-2 py-1"
                  value={it.descripcion_concepto}
                  onChange={(e) => handleItemChange(idx, 'descripcion_concepto', e.target.value)}
                  placeholder="Descripción"
                  required
                />
                <input
                  type="number"
                  className="col-span-1 border rounded px-2 py-1"
                  value={it.cantidad}
                  onChange={(e) => handleItemChange(idx, 'cantidad', Number(e.target.value))}
                  placeholder="Cant"
                  min="1"
                  required
                />
                <input
                  type="number"
                  className="col-span-1 border rounded px-2 py-1"
                  value={it.precio_unitario}
                  onChange={(e) => handleItemChange(idx, 'precio_unitario', Number(e.target.value))}
                  placeholder="Precio"
                  min="0"
                  required
                />
                <span className="col-span-1 text-right text-sm">
                  {(Number(it.cantidad) * Number(it.precio_unitario)).toFixed(2)} €
                </span>
                <button type="button" onClick={() => removeItem(idx)} className="text-red-600 col-span-1">X</button>
              </div>
            ))}
            <button type="button" onClick={addItem} className="text-sm text-blue-600 mt-2">+ Añadir concepto</button>
          </div>
          <div className="bg-gray-50 rounded p-3 mt-4 space-y-1 text-right">
            <div>Base imponible: <b>{base.toFixed(2)} €</b></div>
            <div>IVA: <b>{iva.toFixed(2)} €</b></div>
            <div>Retención: <b>{ret.toFixed(2)} €</b></div>
            <div className="text-lg">Total factura: <b>{total.toFixed(2)} €</b></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-purple-600 text-white">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}