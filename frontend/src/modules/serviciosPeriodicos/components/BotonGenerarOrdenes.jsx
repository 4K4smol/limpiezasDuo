import { useState, useEffect } from 'react'; // Importamos useEffect
import axios from '../../../services/axios';

// Recibimos la prop onOrdersGenerated
export default function BotonGenerarOrdenes({ servicioId, onOrdersGenerated }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState(''); // 'success' o 'error' para estilos dinámicos

  // Efecto para limpiar el mensaje después de un tiempo
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg('');
        setMsgType('');
      }, 3000); // El mensaje desaparecerá después de 3 segundos
      return () => clearTimeout(timer); // Limpieza del temporizador si el componente se desmonta o el mensaje cambia
    }
  }, [msg]); // Este efecto se ejecuta cada vez que 'msg' cambia

  const handleClick = async () => {
    setLoading(true);
    setMsg(''); // Limpiar cualquier mensaje previo inmediatamente al hacer clic
    setMsgType('');
    try {
      const response = await axios.post(`/servicios-periodicos/${servicioId}/generar-ordenes`);
      setMsg(response.data?.message || 'Órdenes generadas ✅'); // Usar mensaje del backend si existe
      setMsgType('success');
      // Si la generación fue exitosa y se proporcionó la función, la llamamos
      if (onOrdersGenerated) {
        onOrdersGenerated();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al generar órdenes';
      setMsg(errorMessage);
      setMsgType('error');
      console.error("Error al generar órdenes:", err); // Para depuración
    } finally {
      setLoading(false);
    }
  };

  // Clase CSS dinámica para el mensaje
  const msgClass = msgType === 'success' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="flex flex-col items-end"> {/* Flexbox para alinear botón y mensaje */}
      <button
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? 'Generando...' : 'Generar Órdenes'}
      </button>
      {msg && (
        <div className={`text-sm mt-1 ${msgClass}`}>
          {msg}
        </div>
      )}
    </div>
  );
}