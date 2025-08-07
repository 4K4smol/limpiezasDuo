import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ordenService } from "../services/ordenService";

export default function NuevaOrden() {
  const navigate = useNavigate();
  const detailId = useRef(0);

  const createDetalle = () => ({
    uid: ++detailId.current,
    id_servicio: "",
    horas_realizadas: 1,
  });

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
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    (async () => {
      try {
        const [clientes, servicios] = await Promise.all([
          ordenService.listClientes(),
          ordenService.listServicios(),
        ]);
        setClientes(clientes);
        setServicios(servicios);
      } catch (err) {
        console.error("Error cargando catálogos:", err);
      } finally {
        setLoading((l) => ({ ...l, catalogs: false }));
      }
    })();
  }, []);

  useEffect(() => {
    if (!formData.id_cliente) {
      setUbicaciones([]);
      return;
    }

    const controller = new AbortController();
    setLoading((l) => ({ ...l, ubicaciones: true }));
    setError(null);

    ordenService
      .listUbicaciones(formData.id_cliente, { signal: controller.signal })
      .then((data) => setUbicaciones(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Error al cargar ubicaciones.");
        }
      })
      .finally(() => {
        setLoading((l) => ({ ...l, ubicaciones: false }));
      });

    return () => controller.abort();
  }, [formData.id_cliente]);

  const clearError = useCallback(() => setError(null), []);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
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
      setFormData((prev) => {
        const detalles = [...prev.detalles];
        detalles[index] = {
          ...detalles[index],
          [field]: field === "horas_realizadas" ? parseFloat(value) || 1 : value,
        };
        return { ...prev, detalles };
      });
      clearError();
    },
    [clearError]
  );

  const agregarDetalle = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      detalles: [...prev.detalles, createDetalle()],
    }));
  }, []);

  const eliminarDetalle = useCallback((index) => {
    setFormData((prev) => ({
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
        .map((d) => Number(d.id_servicio))
        .filter((id) => !isNaN(id) && id > 0)
    );
  }, [formData.detalles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((l) => ({ ...l, submitting: true }));
    setError(null);

    try {
      const detallesValidos = formData.detalles.filter((d) => {
        const id = d.id_servicio;
        return id && id !== "0" && !isNaN(Number(id));
      });

      if (detallesValidos.length === 0) {
        throw new Error("Debes seleccionar al menos un servicio.");
      }

      const payload = {
        id_cliente: Number(formData.id_cliente),
        id_ubicacion: Number(formData.id_ubicacion),
        fecha_programada: formData.fecha_programada,
        hora_programada: formData.hora_programada,
        detalles: detallesValidos.map((d) => ({
          id_servicio: Number(d.id_servicio),
          horas_realizadas: d.horas_realizadas,
        })),
      };

      await ordenService.create(payload);
      navigate("/ordenes-trabajo");
    } catch (err) {
      setError(err.message || "Error al guardar la orden.");
    } finally {
      setLoading((l) => ({ ...l, submitting: false }));
    }
  };

  if (loading.catalogs) {
    return <p className="text-center mt-6">Cargando datos…</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Nueva Orden de Trabajo</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos generales */}
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
                required
              >
                <option value="">-- Selecciona Ubicación --</option>
                {ubicaciones.map((u) => (
                  <option key={u.id_ubicacion} value={u.id_ubicacion}>{u.direccion}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fecha_programada" className="block mb-1 font-medium">Fecha</label>
              <input
                type="date"
                id="fecha_programada"
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
                type="time"
                id="hora_programada"
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

        {/* Servicios */}
        <fieldset className="border p-4 rounded">
          <legend className="px-2 font-semibold">Servicios</legend>
          <div className="space-y-2">
            {formData.detalles.map((detalle, index) => (
              <div key={detalle.uid} className="flex gap-2 items-center">
                <select
                  value={detalle.id_servicio}
                  onChange={(e) => handleDetalleChange(index, "id_servicio", e.target.value)}
                  disabled={loading.submitting}
                  className="flex-grow border p-2 rounded disabled:bg-gray-100"
                  required
                >
                  <option value="">-- Selecciona un Servicio --</option>
                  {servicios.map((s) => {
                    const id = s.id_servicio || s.id;
                    if (!id) return null;
                    const isDisabled = selectedServiceIds.has(Number(id)) && Number(detalle.id_servicio) !== Number(id);
                    return (
                      <option key={id} value={id} disabled={isDisabled}>
                        {s.nombre} {isDisabled ? "(ya agregado)" : ""}
                      </option>
                    );
                  })}
                </select>

                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={detalle.horas_realizadas}
                  onChange={(e) => handleDetalleChange(index, "horas_realizadas", e.target.value)}
                  disabled={loading.submitting}
                  className="w-24 text-center border p-2 rounded"
                  required
                />

                <button
                  type="button"
                  onClick={() => eliminarDetalle(index)}
                  disabled={formData.detalles.length === 1 || loading.submitting}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={agregarDetalle}
            disabled={loading.submitting}
            className="mt-4 font-medium text-indigo-600 hover:text-indigo-800"
          >
            + Añadir Servicio
          </button>
        </fieldset>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading.submitting}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading.submitting}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
          >
            {loading.submitting ? "Guardando…" : "Guardar Orden"}
          </button>
        </div>
      </form>
    </div>
  );
}
