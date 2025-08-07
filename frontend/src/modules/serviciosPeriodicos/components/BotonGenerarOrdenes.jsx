import { useState, useEffect } from 'react';
import axios from '../../../services/axios';

export default function BotonGenerarOrdenes({ servicioId, onOrdersGenerated }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState(''); // success | error

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg('');
        setMsgType('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleClick = async () => {
    if (!confirm("¿Deseas generar las órdenes de este servicio periódico?")) return;

    setLoading(true);
    setMsg('');
    try {
      const res = await axios.post(`/servicios-periodicos/${servicioId}/generar-ordenes`);
      setMsg(res.data?.message || 'Órdenes generadas correctamente ✅');
      setMsgType('success');
      onOrdersGenerated?.();
    } catch (err) {
      console.error(err);
      const error = err.response?.data?.message || 'Error al generar órdenes ❌';
      setMsg(error);
      setMsgType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end space-y-1">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`px-4 py-1 text-sm rounded transition font-medium text-white
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
        `}
      >
        {loading ? 'Generando...' : 'Generar Órdenes'}
      </button>

      {msg && (
        <p className={`text-sm ${msgType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
