import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ordenService } from "../services/ordenService";

export default function NuevaOrden() {
  const navigate = useNavigate();
  const detailId = useRef(0);

  // Fábrica de detalles
  const createDetalle = () => ({
    uid: ++detailId.current,
    id_servicio: "",
    horas_realizadas: 1,
  });

  // Estado general
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);

  const [formData, setFormData] = useState({
    id_cliente: "",
    id_ubicacion: "",
    fecha_programada: "",
    hora_programada: "",
    detalles: [createDetalle()],
  });

  const [loading, setLoading] = useState({
    catalogs: true,
    ubicaciones: false,
    submitting: false,
  });
  const [error, setError] = useState(null);
  const today = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  // Carga inicial de catálogos
  useEffect(() => {
    (async () => {
      try {
        const [c, s] = await Promise.all([
          ordenService.listClientes(),
          ordenService.listServicios(),
        ]);
        setClientes(Array.isArray(c) ? c : []);
        setServicios(Array.isArray(s) ? s : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(l => ({ ...l, catalogs: false }));
      }
    })();
  }, []);

  // Carga de ubicaciones al cambiar cliente
  useEffect(() => {
    if (!formData.id_cliente) {
      setUbicaciones([]);
      return;
    }
    const controller = new AbortController();
    setLoading(l => ({ ...l, ubicaciones: true }));
    setError(null);

    ordenService
      .listUbicaciones(formData.id_cliente, { signal: controller.signal })
      .then(data => {
        setUbicaciones(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Error al cargar ubicaciones.");
        }
      })
      .finally(() => {
        setLoading(l => ({ ...l, ubicaciones: false }));
      });

    return () => controller.abort();
  }, [formData.id_cliente]);

  const clearError = useCallback(() => setError(null), []);

  const handleInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...(name === "id_cliente" ? { id_ubicacion: "" } : {}),
      }));
      clearError();
    },
    [clearError]
  );

  const handleDetalleChange = useCallback(
    (index, field, value) => {
      setFormData(prev => {
        const detalles = [...prev.detalles];
        detalles[index] = {
          ...detalles[index],
          [field]:
            field === "horas_realizadas"
              ? parseFloat(value) || 1
              : value,
        };
        return { ...prev, detalles };
      });
      clearError();
    },
    [clearError]
  );

  const agregarDetalle = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      detalles: [...prev.detalles, createDetalle()],
    }));
  }, []);

  const eliminarDetalle = useCallback(index => {
    setFormData(prev => ({
      ...prev,
      detalles:
        prev.detalles.length > 1
          ? prev.detalles.filter((_, i) => i !== index)
          : prev.detalles,
    }));
  }, []);

  const selectedServiceIds = useMemo(() => {
    return new Set(
      formData.detalles
        .map(d => Number(d.id_servicio))
        .filter(id => !isNaN(id) && id > 0)
    );
  }, [formData.detalles]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(l => ({ ...l, submitting: true }));
    setError(null);

    try {
      // Debug: Log current form data
      console.log('Current formData:', JSON.stringify(formData, null, 2));
      console.log('Available servicios:', servicios);

      // First, validate that at least one service is selected
      const hasValidServices = formData.detalles.some(d => {
        const servicioId = d.id_servicio;
        console.log(`Checking detalle: id_servicio="${servicioId}", type: ${typeof servicioId}`);
        return servicioId &&
          servicioId !== "" &&
          servicioId !== "0" &&
          servicioId !== "undefined" &&  // Add this check
          !isNaN(Number(servicioId)) &&
          Number(servicioId) > 0;
      });

      console.log('hasValidServices:', hasValidServices);

      if (!hasValidServices) {
        throw new Error("Debes seleccionar al menos un servicio.");
      }

      // Now filter and map the valid services
      const detallesValidos = formData.detalles
        .filter(d => {
          const servicioId = d.id_servicio;
          return servicioId &&
            servicioId !== "" &&
            servicioId !== "0" &&
            servicioId !== "undefined" &&  // Add this check
            !isNaN(Number(servicioId)) &&
            Number(servicioId) > 0;
        })
        .map(d => ({
          id_servicio: Number(d.id_servicio),
          horas_realizadas: d.horas_realizadas,
        }));

      const payload = {
        id_cliente: Number(formData.id_cliente),
        id_ubicacion: Number(formData.id_ubicacion),
        fecha_programada: formData.fecha_programada,
        hora_programada: formData.hora_programada,
        detalles: detallesValidos,
      };

      console.log('Payload being sent:', JSON.stringify(payload, null, 2));

      await ordenService.create(payload);
      navigate("/ordenes-trabajo");
    } catch (err) {
      setError(err.message);
      console.error('Submit error:', err);
    } finally {
      setLoading(l => ({ ...l, submitting: false }));
    }
  };

  if (loading.catalogs) {
    return (
      <p className="text-center mt-6">Cargando datos…</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Nueva Orden de Trabajo</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos Generales */}
        <fieldset className="border p-4 rounded">
          <legend className="px-2 font-semibold">Datos Generales</legend>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="id_cliente" className="block mb-1 font-medium">Cliente</label>
              <select
                id="id_cliente"
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">-- Selecciona Cliente --</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.razon_social}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="id_ubicacion" className="block mb-1 font-medium">
                Ubicación {loading.ubicaciones && <span className="text-sm text-gray-500">(cargando…)</span>}
              </label>
              <select
                id="id_ubicacion"
                name="id_ubicacion"
                value={formData.id_ubicacion}
                onChange={handleInputChange}
                disabled={!formData.id_cliente || loading.ubicaciones || loading.submitting}
                className="w-full border p-2 rounded disabled:bg-gray-100"
                required={ubicaciones.length > 0}
              >
                <option value="">
                  {ubicaciones.length ? "-- Selecciona Ubicación --" : "-- Sin ubicaciones --"}
                </option>
                {ubicaciones.map((u) => (
                  <option key={u.id_ubicacion} value={u.id_ubicacion}>{u.direccion}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fecha_programada" className="block mb-1 font-medium">Fecha</label>
              <input
                id="fecha_programada"
                type="date"
                name="fecha_programada"
                value={formData.fecha_programada}
                min={today}
                onChange={handleInputChange}
                disabled={loading.submitting}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="hora_programada" className="block mb-1 font-medium">Hora</label>
              <input
                id="hora_programada"
                type="time"
                name="hora_programada"
                value={formData.hora_programada}
                onChange={handleInputChange}
                disabled={loading.submitting}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Servicios - SECCIÓN CORREGIDA */}
        <fieldset className="border p-4 rounded">
          <legend className="px-2 font-semibold">Servicios</legend>

          {/* Debug info - remover en producción */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
              <strong>Debug:</strong> {servicios.length} servicios cargados
            </div>
          )}

          <div className="space-y-2">
            {formData.detalles.map((detalle, index) => (
              <div key={detalle.uid} className="flex gap-2 items-center">
                <select
                  value={detalle.id_servicio}
                  onChange={(e) => handleDetalleChange(index, "id_servicio", e.target.value)}
                  disabled={loading.submitting}
                  className="flex-grow w-full border p-2 rounded disabled:bg-gray-100"
                  required
                >
                  <option value="">-- Selecciona un Servicio --</option>
                  {servicios.map(s => {
                    // FIX: Ensure we have a valid service ID
                    const serviceId = s.id_servicio || s.id; // fallback to s.id if id_servicio is undefined

                    if (!serviceId) {
                      console.warn('Service without valid ID:', s);
                      return null; // Skip services without valid IDs
                    }

                    const isSelectedElsewhere = selectedServiceIds.has(Number(serviceId));
                    const isSelectedInThisRow = Number(detalle.id_servicio) === Number(serviceId);
                    const isDisabled = isSelectedElsewhere && !isSelectedInThisRow;

                    return (
                      <option
                        key={serviceId}
                        value={String(serviceId)}
                        disabled={isDisabled}
                      >
                        {s.nombre} {isDisabled ? "(ya agregado)" : ""}
                      </option>
                    );
                  }).filter(Boolean)} {/* Remove null entries */}
                </select>

                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={detalle.horas_realizadas}
                  onChange={(e) => handleDetalleChange(index, "horas_realizadas", e.target.value)}
                  disabled={loading.submitting}
                  className="w-24 text-center border p-2 rounded disabled:bg-gray-100"
                  required
                  aria-label="Horas realizadas"
                />

                <button
                  type="button"
                  onClick={() => eliminarDetalle(index)}
                  disabled={formData.detalles.length === 1 || loading.submitting}
                  className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed flex-shrink-0"
                  aria-label="Eliminar servicio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={agregarDetalle}
            disabled={loading.submitting}
            className="mt-4 font-medium text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
          >
            + Añadir Servicio
          </button>
        </fieldset>

        {/* Mostrar errores */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading.submitting}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading.submitting}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-wait"
          >
            {loading.submitting ? "Guardando…" : "Guardar Orden"}
          </button>
        </div>
      </form>
    </div>
  );
}