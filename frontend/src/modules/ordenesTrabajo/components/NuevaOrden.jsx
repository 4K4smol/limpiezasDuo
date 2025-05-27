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
    const [ubicaciones, setUbicaciones] = useState([]); // State for client locations

    const [formData, setFormData] = useState({
        id_cliente: '',
        id_ubicacion: '', // Correctly part of formData
        id_empleado: 1, // Assuming this is a fixed default or will be handled elsewhere
        fecha_programada: '',
        hora_programada: '',
        detalles: [{ ...initialDetalle }]
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Fetch initial data (clientes, servicios)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [clientesRes, serviciosRes] = await Promise.all([
                    axios.get(API_CLIENTES_URL),
                    axios.get(API_SERVICIOS_URL)
                ]);
                setClientes(clientesRes.data?.data || []);
                setServicios(serviciosRes.data?.data || []); // Assuming serviciosRes.data.data, adjust if it's serviciosRes.data

            } catch (err) {
                console.error("Error fetching initial data:", err);
                setError('Error al cargar los datos iniciales. Intente recargar la página.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fetch ubicaciones when id_cliente changes
    useEffect(() => {
        if (!formData.id_cliente) {
            setUbicaciones([]);
            // formData.id_ubicacion is already reset by handleInputChange
            return;
        }

        const fetchUbicaciones = async () => {
            setLoading(true); // Can use a more specific loading state if preferred
            setError(null);
            try {
                const res = await axios.get(`/clientes/${formData.id_cliente}/ubicaciones`);
                // Adjust based on your API response structure for ubicaciones
                // If it's res.data.data, use that. If it's just res.data, use that.
                setUbicaciones(res.data?.data || res.data || []);
            } catch (err) {
                console.error("Error al cargar ubicaciones:", err);
                setUbicaciones([]);
                setError('Error al cargar las ubicaciones del cliente.');
            } finally {
                setLoading(false); // Or the specific loading state
            }
        };

        fetchUbicaciones();
    }, [formData.id_cliente]);


    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(null);

        // If client changes, reset ubicacion as well
        if (name === 'id_cliente') {
            setFormData(prev => ({ ...prev, id_ubicacion: '' }));
        }
    }, [error]); // Add error to dependencies if setError is called within

    const handleDetalleChange = useCallback((i, field, value) => {
        const newDetalles = [...formData.detalles];
        newDetalles[i] = {
            ...newDetalles[i],
            [field]: field === 'horas_realizadas' ? parseFloat(value) || 0 : value
        };
        setFormData((prev) => ({ ...prev, detalles: newDetalles }));
        if (error) setError(null);
    }, [formData.detalles, error]);

    const agregarDetalle = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            detalles: [...prev.detalles, { ...initialDetalle }]
        }));
    }, []);

    const eliminarDetalle = useCallback((i) => {
        if (formData.detalles.length <= 1) return;
        setFormData((prev) => ({
            ...prev,
            detalles: prev.detalles.filter((_, index) => index !== i)
        }));
    }, [formData.detalles.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const { id_cliente, id_ubicacion, fecha_programada, hora_programada, detalles } = formData;

        if (!id_cliente || !fecha_programada || !hora_programada) {
            setError('Completa todos los campos generales (Cliente, Fecha, Hora).');
            setSubmitting(false);
            return;
        }

        // Validate id_ubicacion only if client is selected and there are ubicaciones available
        if (id_cliente && ubicaciones.length > 0 && !id_ubicacion) {
            setError('Selecciona una ubicación para el cliente.');
            setSubmitting(false);
            return;
        }

        if (detalles.some((d) => !d.id_servicio || d.horas_realizadas <= 0)) {
            setError('Completa correctamente todos los servicios (selecciona un servicio y asegúrate que las horas sean mayores a 0).');
            setSubmitting(false);
            return;
        }

        const idsServicios = detalles.map((d) => d.id_servicio);
        if (new Set(idsServicios).size !== idsServicios.length) {
            setError('No puedes repetir servicios en la misma orden.');
            setSubmitting(false);
            return;
        }

        try {
            // Construct payload, ensure id_ubicacion is only sent if it has a value
            const payload = { ...formData };
            if (!payload.id_ubicacion) {
                delete payload.id_ubicacion; // Or set to null, depending on backend expectation
            }
            await axios.post(API_ORDENES_URL, payload);
            navigate('/dashboard', { replace: true, state: { message: 'Orden creada con éxito' } });
        } catch (err) {
            console.error("Error creating order:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Error al crear la orden. Intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    if (loading && clientes.length === 0 && servicios.length === 0) return <p className="text-center mt-6">Cargando datos iniciales...</p>;

    // More robust error display for initial data load failure
    if (error && clientes.length === 0 && servicios.length === 0 && !loading) {
        return (
            <div className="text-center mt-6 text-red-600">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Reintentar Carga
                </button>
            </div>
        );
    }


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6 mb-10">
            <h1 className="text-2xl font-bold mb-6 text-gray-700">Nueva Orden de Trabajo</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Datos Generales */}
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-semibold px-2 text-gray-600">Datos Generales</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                            <label htmlFor="id_cliente" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                            <select
                                id="id_cliente"
                                name="id_cliente"
                                value={formData.id_cliente}
                                onChange={handleInputChange}
                                disabled={submitting || loading}
                                className="w-full border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">-- Selecciona Cliente --</option>
                                {clientes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.razon_social} ({c.cif})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {formData.id_cliente && (
                            <div>
                                <label htmlFor="id_ubicacion" className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                                <select
                                    id="id_ubicacion"
                                    name="id_ubicacion"
                                    value={formData.id_ubicacion}
                                    onChange={handleInputChange}
                                    className="w-full border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={submitting || loading || !ubicaciones.length}
                                    required={ubicaciones.length > 0} // Required only if locations exist
                                >
                                    <option value="">
                                        {loading && formData.id_cliente ? 'Cargando ubicaciones...' :
                                            !ubicaciones.length ? '-- Sin ubicaciones disponibles --' : '-- Selecciona Ubicación --'}
                                    </option>
                                    {ubicaciones.map((u) => (
                                        <option key={u.id_ubicacion || u.id} value={u.id_ubicacion || u.id}> {/* Adapt key/value based on your API */}
                                            {u.direccion} {u.localidad ? `(${u.localidad})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {loading && formData.id_cliente && <p className="text-xs text-gray-500 mt-1">Cargando ubicaciones...</p>}
                            </div>
                        )}

                        <div>
                            <label htmlFor="fecha_programada" className="block text-sm font-medium text-gray-700 mb-1">Fecha Programada</label>
                            <input
                                id="fecha_programada"
                                type="date"
                                name="fecha_programada"
                                value={formData.fecha_programada}
                                onChange={handleInputChange}
                                min={today}
                                disabled={submitting || loading}
                                className="w-full border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="hora_programada" className="block text-sm font-medium text-gray-700 mb-1">Hora Programada</label>
                            <input
                                id="hora_programada"
                                type="time"
                                name="hora_programada"
                                value={formData.hora_programada}
                                onChange={handleInputChange}
                                disabled={submitting || loading}
                                className="w-full border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Servicios */}
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-semibold px-2 text-gray-600">Servicios a Realizar</legend>
                    {formData.detalles.map((d, i) => (
                        <div key={i} className="flex gap-3 items-center mb-3 p-2 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
                            <select
                                name={`detalle_servicio_${i}`} // Unique name for accessibility, not used for state directly
                                value={d.id_servicio}
                                onChange={(e) => handleDetalleChange(i, 'id_servicio', e.target.value)}
                                disabled={submitting || loading}
                                className="flex-grow border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">-- Selecciona Servicio --</option>
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
                                name={`detalle_horas_${i}`} // Unique name for accessibility
                                value={d.horas_realizadas}
                                onChange={(e) => handleDetalleChange(i, 'horas_realizadas', e.target.value)}
                                className="w-28 text-center border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={submitting || loading}
                                placeholder="Horas"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => eliminarDetalle(i)}
                                disabled={formData.detalles.length <= 1 || submitting || loading}
                                className="text-red-500 hover:text-red-700 disabled:opacity-50 px-2 py-1 rounded-md"
                                title="Eliminar servicio"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={agregarDetalle}
                        disabled={submitting || loading}
                        className="text-indigo-600 hover:text-indigo-800 text-sm mt-3 py-1 px-2 border border-indigo-600 rounded-md hover:bg-indigo-50 disabled:opacity-50"
                    >
                        + Añadir Servicio
                    </button>
                </fieldset>

                {error && <p className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-md">{error}</p>}

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        disabled={submitting}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={
                            submitting || loading ||
                            !formData.id_cliente ||
                            !formData.fecha_programada ||
                            !formData.hora_programada ||
                            (ubicaciones.length > 0 && !formData.id_ubicacion) || // Required if locations exist
                            formData.detalles.some((d) => !d.id_servicio || d.horas_realizadas <= 0)
                        }
                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Guardando...' : 'Guardar Orden'}
                    </button>
                </div>
            </form>
        </div>
    );
}