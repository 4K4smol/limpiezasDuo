// clientes/components/ClientForm.jsx
import { useEffect, useRef, useState } from 'react';

const empty = {
  razon_social: '',
  cif: '',
  direccion: '',
  codigo_postal: '',
  ciudad: '',
  telefono: '',
  email: '',
  activo: 1,
};

export default function ClientForm({ open, onClose, onSave, initialValues, errorFields = {} }) {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef(null);
  const firstInput = useRef(null);

  // Reset form cuando cambian los valores iniciales o se abre/cierra el modal
  useEffect(() => {
    setForm(initialValues || empty);
    setSubmitting(false);
  }, [initialValues, open]);

  // Autofocus primer campo
  useEffect(() => {
    if (open && firstInput.current) firstInput.current.focus();
  }, [open]);

  // Cierre con ESC y click fuera
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => e.key === "Escape" && onClose();
    const onClickOutside = (e) => modalRef.current && !modalRef.current.contains(e.target) && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open, onClose]);

  const handleChange = ({ target }) => {
    const { name, type, value, checked } = target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? (checked ? 1 : 0) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSave(form);
    setSubmitting(false);
  };

  if (!open) return null;

  // Campos definidos aquí para centralizar y modificar fácil
  const fields = [
    { name: "razon_social", label: "Razón social*", required: true },
    { name: "cif", label: "CIF*", required: true },
    { name: "direccion", label: "Dirección*", required: true },
    { name: "codigo_postal", label: "Código postal" },
    { name: "ciudad", label: "Ciudad" },
    { name: "telefono", label: "Teléfono" },
    { name: "email", label: "Email" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-6 relative animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-xl font-semibold">
          {form.id_cliente ? "Editar cliente" : "Nuevo cliente"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ name, label, required }, idx) => (
            <div key={name} className="col-span-1 sm:col-span-2 flex flex-col">
              <input
                ref={idx === 0 ? firstInput : undefined}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={label}
                required={!!required}
                className={`border rounded-xl px-3 py-2 focus:outline-primary ${
                  errorFields[name] ? "border-red-400" : ""
                }`}
                autoComplete="off"
                aria-invalid={!!errorFields[name]}
                aria-describedby={errorFields[name] ? `${name}-error` : undefined}
              />
              {errorFields[name] && (
                <span id={`${name}-error`} className="text-xs text-red-600 mt-0.5">
                  {errorFields[name]}
                </span>
              )}
            </div>
          ))}

          <label className="flex items-center gap-2 col-span-1 sm:col-span-2 select-none">
            <input
              type="checkbox"
              name="activo"
              checked={!!form.activo}
              onChange={handleChange}
            />
            Activo
          </label>

          <div className="col-span-1 sm:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border hover:bg-gray-100 transition"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow hover:brightness-90 transition disabled:opacity-50"
              disabled={submitting}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
