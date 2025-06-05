import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Package, AlertTriangle } from 'lucide-react';

export default function InventarioForm({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  disabled = false
}) {
  // --- Estado inicial del formulario
  const [form, setForm] = useState({
    nombre_item: '',
    descripcion: '',
    cantidad_actual: 0,
    stock_minimo: 0,
    unidad: '',
    ubicacion: '',
    activo: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isEditMode = useMemo(() => Boolean(initialData?.id_item), [initialData]);

  // --- Inicializar datos
  useEffect(() => {
    if (isEditMode) {
      setForm({
        nombre_item: initialData.nombre_item || '',
        descripcion: initialData.descripcion || '',
        cantidad_actual: initialData.cantidad_actual ?? 0,
        stock_minimo: initialData.stock_minimo ?? 0,
        unidad: initialData.unidad || '',
        ubicacion: initialData.ubicacion || '',
        activo: initialData.activo ?? true,
      });
    } else {
      setForm({
        nombre_item: '',
        descripcion: '',
        cantidad_actual: 0,
        stock_minimo: 0,
        unidad: '',
        ubicacion: '',
        activo: true,
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData, isEditMode]);

  // --- Validación de campos
  const validateField = useCallback((name, value) => {
    const numberValidation = (min, max) => {
      if (value === '' || value == null) return 'Campo requerido';
      if (isNaN(value) || value < min) return `Debe ser un número ≥ ${min}`;
      if (value > max) return `No puede exceder ${max.toLocaleString()}`;
      return '';
    };

    switch (name) {
      case 'nombre_item':
        if (!value.trim()) return 'Requerido';
        if (value.length < 2) return 'Mínimo 2 caracteres';
        if (value.length > 100) return 'Máximo 100 caracteres';
        return '';
      case 'cantidad_actual':
        return numberValidation(0, 999999);
      case 'stock_minimo':
        return numberValidation(0, 9999);
      case 'unidad':
        if (!value.trim()) return 'Requerido';
        if (value.length > 20) return 'Máximo 20 caracteres';
        return '';
      case 'descripcion':
        return value.length > 500 ? 'Máximo 500 caracteres' : '';
      case 'ubicacion':
        return value.length > 100 ? 'Máximo 100 caracteres' : '';
      default:
        return '';
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    for (const key in form) {
      if (key !== 'activo') {
        const err = validateField(key, form[key]);
        if (err) newErrors[key] = err;
      }
    }
    return newErrors;
  }, [form, validateField]);

  const isFormValid = useMemo(() => Object.keys(validateForm()).length === 0, [validateForm]);

  // --- Manejadores
  const handleChange = useCallback(e => {
    const { name, type, value, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : type === 'number' ? Number(value) : value;
    setForm(prev => ({ ...prev, [name]: newValue }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, newValue) }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback(e => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, form[name]) }));
  }, [validateField, form]);

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map(k => [k, true]));
    setTouched(allTouched);
    const formErrs = validateForm();
    setErrors(formErrs);

    if (Object.keys(formErrs).length === 0) {
      onSubmit({
        ...form,
        cantidad_actual: Number(form.cantidad_actual),
        stock_minimo: Number(form.stock_minimo),
        nombre_item: form.nombre_item.trim(),
        descripcion: form.descripcion.trim(),
        unidad: form.unidad.trim(),
        ubicacion: form.ubicacion.trim(),
      });
    }
  }, [form, validateForm, onSubmit]);

  // --- Campos
  const textFields = [
    { name: 'nombre_item', label: 'Nombre del Ítem', required: true, placeholder: 'Ej: Papel A4' },
    { name: 'descripcion', label: 'Descripción', placeholder: 'Opcional' },
    { name: 'unidad', label: 'Unidad', required: true, placeholder: 'Ej: piezas' },
    { name: 'ubicacion', label: 'Ubicación', placeholder: 'Opcional' },
  ];

  const numberFields = [
    { name: 'cantidad_actual', label: 'Cantidad Actual', required: true, min: 0, max: 999999 },
    { name: 'stock_minimo', label: 'Stock Mínimo', required: true, min: 0, max: 9999 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-600" />
          {isEditMode ? 'Editar Ítem' : 'Nuevo Ítem'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6" noValidate>
        {/* Text Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {textFields.map(({ name, label, required, placeholder }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                id={name}
                name={name}
                type="text"
                value={form[name]}
                placeholder={placeholder}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={disabled || isLoading}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 ${errors[name] && touched[name] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
              />
              {errors[name] && touched[name] && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors[name]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Number Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {numberFields.map(({ name, label, min, max }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                id={name}
                name={name}
                type="number"
                min={min}
                max={max}
                value={form[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={disabled || isLoading}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 ${errors[name] && touched[name] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
              />
              {errors[name] && touched[name] && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors[name]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            id="activo"
            name="activo"
            type="checkbox"
            checked={form.activo}
            onChange={handleChange}
            disabled={disabled || isLoading}
            className="h-4 w-4 text-purple-600 border-gray-300 rounded"
          />
          <label htmlFor="activo" className="text-sm text-gray-700">
            Activo
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled || isLoading}
            className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isLoading || disabled}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center space-x-2"
          >
            {isLoading && (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            <span>{isEditMode ? 'Guardar Cambios' : 'Crear Ítem'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
