import { useState, useEffect } from "react";
import axios from "../../../services/axios";
import { useNavigate } from "react-router-dom";

/* Endpoints */
const API_CLIENTES = "/clientes";
const API_SERVICIOS = "/servicios";
const API_CONTRATOS = "/servicios-periodicos";

/* ----- Helpers -------------------------------------------------------- */
const newLinea = (semana) => ({
    id_servicio: "",
    id_ubicacion: "",   // ← string, no array
    semana_mensual: semana,
    dia_hora: "",
});

const explodeByUbic = (progs) =>
    progs.flatMap((p) =>
        (Array.isArray(p.id_ubicacion) ? p.id_ubicacion : [p.id_ubicacion]).map((u) => ({
            ...p,
            id_ubicacion: u,
        }))
    );

/* --------------------------------------------------------------------- */
export default function NuevoServicioPeriodico() {
    const navigate = useNavigate();

    /* catálogos */
    const [clientes, setClientes] = useState([]);
    const [servicios, setServicios] = useState([]);

    /* formulario */
    const [form, setForm] = useState({
        id_cliente: "",
        periodicidad_mensual: 1, // 1 | 2 | 4
        activo: true,
        programaciones: [newLinea(1)],
    });

    /* ui state */
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    /* --- carga inicial de catálogos --- */
    useEffect(() => {
        (async () => {
            try {
                const [cliRes, srvRes] = await Promise.all([
                    axios.get(API_CLIENTES),
                    axios.get(API_SERVICIOS),
                ]);
                setClientes(cliRes.data?.data || cliRes.data || []);
                setServicios(srvRes.data?.data || srvRes.data || []);
            } catch {
                setError("No se pudieron cargar los catálogos.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* ubicaciones del cliente seleccionado */
    const [ubicaciones, setUbicaciones] = useState([]);
    useEffect(() => {
        if (!form.id_cliente) {
            setUbicaciones([]);
            return;
        }

        axios
            .get(`/clientes/${form.id_cliente}/ubicaciones`)
            .then((res) => setUbicaciones(res.data))
            .catch(() => {
                setUbicaciones([]);
                console.error("Error al cargar ubicaciones");
            });
    }, [form.id_cliente]);

    /* --- ajusta nº de líneas al cambiar periodicidad --- */
    useEffect(() => {
        setForm((prev) => {
            const n = Number(prev.periodicidad_mensual);
            let lines = [...prev.programaciones];
            if (lines.length < n) {
                for (let i = lines.length; i < n; i++) lines.push(newLinea(i + 1));
            } else if (lines.length > n) {
                lines = lines.slice(0, n);
            }
            lines = lines.map((l, idx) => ({ ...l, semana_mensual: idx + 1 }));
            return { ...prev, programaciones: lines };
        });
    }, [form.periodicidad_mensual]);

    /* --- setters ------ */
    const setField = (name, value) => setForm((p) => ({ ...p, [name]: value }));

    const setLinea = (idx, field, value) => {
        setForm((p) => {
            const arr = [...p.programaciones];
            arr[idx] = { ...arr[idx], [field]: value };
            return { ...p, programaciones: arr };
        });
    };

    /* --- submit --- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        if (!form.id_cliente) {
            setError("Selecciona un cliente.");
            setSaving(false);
            return;
        }

        const bad = form.programaciones.some(
            (l) => !l.id_servicio || !l.id_ubicacion || !l.dia_hora
        );

        if (bad) {
            setError("Completa todos los campos de cada programación.");
            setSaving(false);
            return;
        }

        const payload = { ...form, programaciones: explodeByUbic(form.programaciones) };

        try {
            await axios.post(API_CONTRATOS, payload);
            navigate("/servicios-periodicos", { replace: true, state: { msg: "Contrato creado." } });
        } catch (err) {
            setError(err.response?.data?.message || "Error al guardar.");
        } finally {
            setSaving(false);
        }
    };

    /* ------------------ UI ------------------ */
    if (loading) return <p className="text-center mt-6">Cargando…</p>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
            <h1 className="text-2xl font-bold mb-6">Nuevo Servicio Periódico</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Paso 1 */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="id_cliente" className="block mb-1 font-medium">Cliente</label>
                        <select
                            id="id_cliente"
                            value={form.id_cliente}
                            onChange={(e) => setField("id_cliente", e.target.value)}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">-- Selecciona --</option>
                            {clientes.map((c) => (
                                <option key={c.id} value={c.id}>{c.razon_social}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="periodicidad_mensual" className="block mb-1 font-medium">Periodicidad (veces/mes)</label>
                        <select
                            id="periodicidad_mensual"
                            value={form.periodicidad_mensual}
                            onChange={(e) => setField("periodicidad_mensual", e.target.value)}
                            className="w-full border p-2 rounded"
                        >
                            {[1, 2, 4].map((v) => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end gap-2">
                        <label htmlFor="activo" className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="activo"
                                checked={form.activo}
                                onChange={(e) => setField("activo", e.target.checked)}
                                className="form-checkbox h-4 w-4 text-blue-600 rounded"
                            />
                            Activo
                        </label>
                    </div>
                </section>

                {/* Paso 2: programaciones */}
                <section>
                    <h2 className="text-lg font-semibold mb-4">Programaciones</h2>
                    {form.programaciones.map((l, idx) => (
                        <div key={idx} className="border rounded p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* servicio */}
                            <div>
                                <label htmlFor={`servicio-${idx}`} className="block mb-1">Servicio</label>
                                <select
                                    id={`servicio-${idx}`}
                                    value={l.id_servicio}
                                    onChange={(e) => setLinea(idx, "id_servicio", e.target.value)}
                                    className="w-full border p-2 rounded"
                                    required
                                >
                                    <option value="">-- Servicio --</option>
                                    {servicios.map((s) => (
                                        <option key={s.id} value={s.id}>{s.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ubicaciones (selector nativo múltiple) */}
                            <div>
                                <label htmlFor={`ubicaciones-${idx}`} className="block mb-1">
                                    Ubicación
                                </label>
                                <select
                                    id={`ubicaciones-${idx}`}
                                    value={l.id_ubicacion}
                                    onChange={(e) => setLinea(idx, "id_ubicacion", e.target.value)}
                                    className="w-full border p-2 rounded"
                                    disabled={!ubicaciones.length}
                                    required
                                >
                                    <option value="" disabled>Selecciona una ubicación</option>
                                    {ubicaciones.map((u) => (
                                        <option key={u.id_ubicacion} value={u.id_ubicacion}>
                                            {u.direccion}
                                        </option>
                                    ))}
                                </select>
                            </div>




                            {/* Fecha y Hora */}
                            <div>
                                <label htmlFor={`dia_hora-${idx}`} className="block mb-1">Día y Hora</label>
                                <input
                                    type="datetime-local"
                                    id={`dia_hora-${idx}`}
                                    value={l.dia_hora}
                                    onChange={(e) => setLinea(idx, "dia_hora", e.target.value)}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>

                            {/* Semana mensual (read-only, derived from index) */}
                            <div>
                                <label className="block mb-1">Semana Mensual</label>
                                <input
                                    type="number"
                                    value={l.semana_mensual}
                                    className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
                                    readOnly
                                    disabled
                                />
                            </div>
                        </div>
                    ))}
                </section>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/servicios-periodicos")}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={saving}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={saving}
                    >
                        {saving ? "Guardando..." : "Guardar Servicio Periódico"}
                    </button>
                </div>
            </form>
        </div>
    );
}