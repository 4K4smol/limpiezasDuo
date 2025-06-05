import { useEffect, useState, useCallback } from 'react'; // Agregamos useCallback
import axios from "../../../services/axios";
import { Link } from "react-router-dom";
import BotonGenerarOrdenes from '../components/BotonGenerarOrdenes'; // Asegúrate de que esta ruta sea correcta

/* Endpoint */
const API_CONTRATOS = "/servicios-periodicos";

export default function ServicioPeriodicoPage() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado para manejar errores

  // Función para cargar los servicios, memoizada con useCallback
  const fetchServicios = useCallback(async () => {
    setLoading(true);
    setError(null); // Limpiar cualquier error previo antes de una nueva consulta
    try {
      const res = await axios.get(API_CONTRATOS);
      setServicios(res.data.data || []);
    } catch (err) {
      console.error("Error al cargar servicios periódicos:", err);
      setError("No se pudieron cargar los servicios periódicos. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, []); // El array de dependencias vacío asegura que la función se cree una sola vez

  useEffect(() => {
    fetchServicios(); // Llamada inicial para cargar los datos
  }, [fetchServicios]); // El efecto se ejecuta cuando fetchServicios cambia (solo en el montaje inicial debido a useCallback)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600 text-lg">Cargando servicios periódicos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
        <p className="text-gray-500 mt-2">Por favor, verifica tu conexión o inténtalo más tarde.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Servicios Periódicos</h1>
        <Link
          to="/servicios-periodicos/nuevo" // Asegúrate de que esta sea la ruta correcta para crear
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nuevo Servicio Periódico
        </Link>
      </div>

      {servicios.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-xl">No hay servicios periódicos registrados.</p>
          <p className="text-gray-500 mt-2">Haz clic en "Nuevo Servicio Periódico" para empezar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periodicidad
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activo
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servicios.map(sp => (
                <tr key={sp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sp.cliente?.razon_social || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sp.periodicidad}{sp.periodicidad === 1 ? ' vez' : ' veces'}/mes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold">
                    {sp.activo ? (
                      <span className="text-green-600">Sí</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Pasamos la función fetchServicios como prop para que el botón pueda activarla */}
                    <BotonGenerarOrdenes servicioId={sp.id} onOrdersGenerated={fetchServicios} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}