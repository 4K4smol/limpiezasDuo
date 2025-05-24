import { useState, useEffect, useCallback } from 'react';
import axios from '../../../services/axios'; // ajusta la ruta si estás en otra carpeta
import { useNavigate } from 'react-router-dom';

const API_CLIENTES_URL = '/clientes';
const API_SERVICIOS_URL = '/servicios';
const API_ORDENES_URL = '/ordenes-trabajo';

const initialDetalle = { id_servicio: '', horas_realizadas: 1 };

export default function NuevaOrden() {
    const navigate = useNavigate();

    const [clientes, setClientes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [formData, setFormData] = useState({
        id_cliente: '',
        id_ubicacion: '',
        id_empleado: 1,
        fecha_programada: '',
        hora_programada: '',
        detalles: [{ ...initialDetalle }]
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientesRes, serviciosRes] = await Promise.all([
                    axios.get(API_CLIENTES_URL),
                    axios.get(API_SERVICIOS_URL)
                ]);
                setClientes(clientesRes.data?.data || []);
                setServicios(serviciosRes.data || []);

            } catch (err) {
                setError('Error al cargar los datos iniciales.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'id_cliente' ? { id_ubicacion: '' } : {}) // reset ubicación si cambia cliente
        }));

        if (error) setError(null);
    };


    const handleDetalleChange = (i, field, value) => {
        const detalles = [...formData.detalles];
        detalles[i][field] = field === 'horas_realizadas' ? parseFloat(value) || 0 : value;
        setFormData((prev) => ({ ...prev, detalles }));
        if (error) setError(null);
    };

    const agregarDetalle = () =>
        setFormData((prev) => ({
            ...prev,
            detalles: [...prev.detalles, { ...initialDetalle }]
        }));

    const eliminarDetalle = (i) => {
        if (formData.detalles.length <= 1) return;
        setFormData((prev) => ({
            ...prev,
            detalles: prev.detalles.filter((_, index) => index !== i)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const { id_cliente, fecha_programada, hora_programada, detalles } = formData;

        if (!id_cliente || !fecha_programada || !hora_programada) {
            setError('Completa todos los campos generales.');
            setSubmitting(false);
            return;
        }

        if (detalles.some((d) => !d.id_servicio || d.horas_realizadas <= 0)) {
            setError('Completa correctamente todos los servicios.');
            setSubmitting(false);
            return;
        }

        const ids = detalles.map((d) => d.id_servicio);
        if (new Set(ids).size !== ids.length) {
            setError('No repitas servicios.');
            setSubmitting(false);
            return;
        }

        try {
            await axios.post(API_ORDENES_URL, formData);
            navigate('/dashboard', { replace: true, state: { message: 'Orden creada con éxito' } });
        } catch (err) {
            setError('Error al crear la orden.');
        } finally {
            setSubmitting(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    if (loading) return <p className="text-center mt-6">Cargando datos...</p>;
    if (error && clientes.length === 0 && servicios.length === 0)
        return (
            <div className="text-center mt-6 text-red-600">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Reintentar</button>
            </div>
        );

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6 mb-10">
            <h1 className="text-2xl font-bold mb-4">Nueva Orden de Trabajo</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Datos Generales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label>Cliente</label>
                        <select
                            name="id_cliente"
                            value={formData.id_cliente}
                            onChange={handleInputChange}
                            disabled={submitting}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">-- Selecciona --</option>
                            {clientes.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.razon_social} ({c.cif})
                                </option>
                            ))}
                        </select>
                    </div>
                    {formData.id_cliente && (
                        <div>
                            <label>Ubicación</label>
                            <select
                                name="id_ubicacion"
                                value={formData.id_ubicacion}
                                onChange={handleInputChange}
                                disabled={submitting}
                                className="w-full border p-2 rounded"
                                required
                            >
                                <option value="">-- Selecciona ubicación --</option>
                                {clientes
                                    .find((c) => c.id.toString() === formData.id_cliente.toString())
                                    ?.ubicaciones.map((u) => (
                                        <option key={u.id_ubicacion} value={u.id_ubicacion}>
                                            {u.direccion} ({u.descripcion})
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <label>Fecha</label>
                        <input
                            type="date"
                            name="fecha_programada"
                            value={formData.fecha_programada}
                            onChange={handleInputChange}
                            min={today}
                            disabled={submitting}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label>Hora</label>
                        <input
                            type="time"
                            name="hora_programada"
                            value={formData.hora_programada}
                            onChange={handleInputChange}
                            disabled={submitting}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                </div>

                {/* Servicios */}
                <div>
                    <h2 className="font-semibold mb-2">Servicios</h2>
                    {formData.detalles.map((d, i) => (
                        <div key={i} className="flex gap-2 items-center mb-2">
                            <select
                                value={d.id_servicio}
                                onChange={(e) => handleDetalleChange(i, 'id_servicio', e.target.value)}
                                disabled={submitting}
                                className="flex-grow border p-2 rounded"
                                required
                            >
                                <option value="">-- Servicio --</option>
                                {servicios.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.nombre}
                                    </option>
                                ))}

                            </select>
                            <input
                                type="number"
                                min="0.5"
                                step="0.5"
                                value={d.horas_realizadas}
                                onChange={(e) => handleDetalleChange(i, 'horas_realizadas', e.target.value)}
                                className="w-24 text-center border p-2 rounded"
                                disabled={submitting}
                            />
                            <button
                                type="button"
                                onClick={() => eliminarDetalle(i)}
                                disabled={formData.detalles.length <= 1 || submitting}
                                className="text-red-600 text-lg font-bold"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={agregarDetalle} disabled={submitting} className="text-blue-600 text-sm mt-2">
                        + Añadir Servicio
                    </button>
                </div>

                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} disabled={submitting} className="border px-4 py-2 rounded">
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={
                            submitting ||
                            !formData.id_cliente ||
                            formData.detalles.some((d) => !d.id_servicio || d.horas_realizadas <= 0)
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        {submitting ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
}
