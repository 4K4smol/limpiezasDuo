import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';

const InventoryTable = ({ items }) => {
  if (!items.length) {
    return (
      <p className="text-gray-500 mt-4">
        No hay ítems en el inventario.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-purple-700">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Nombre</th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Descripción</th>
            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Cantidad</th>
            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Stock Mínimo</th>
            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Unidad</th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Ubicación</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr
              key={item.id}
              className={`transition duration-150 ease-in-out ${
                item.cantidad_actual <= item.stock_minimo
                  ? 'bg-red-50 hover:bg-red-100'
                  : 'hover:bg-purple-50'
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.nombre_item}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {item.descripcion}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-center text-sm font-semibold ${
                  item.cantidad_actual <= item.stock_minimo
                    ? 'text-red-700'
                    : 'text-gray-800'
                }`}
              >
                {item.cantidad_actual}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                {item.stock_minimo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {item.unidad}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {item.ubicacion}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const InventarioPage = () => {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState(''); // (Opcional) Para filtrar por nombre

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const response = await axios.get('/inventario');
        if (response?.data?.data) {
          setItems(response.data.data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar el inventario.');
      } finally {
        setCargando(false);
      }
    };

    fetchInventario();
  }, []);

  // (Opcional) Filtro por nombre.
  const filteredItems = items.filter((item) =>
    item.nombre_item.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventario</h1>

      {/* (Opcional) Barra de búsqueda */}
      <div className="mb-4">
        <label htmlFor="search" className="block mb-1 font-semibold text-gray-700">
          Buscar por nombre:
        </label>
        <input
          id="search"
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Ej: Tornillos"
          className="px-3 py-2 border border-gray-300 rounded outline-none"
        />
      </div>

      {cargando && <p>Cargando inventario...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Renderizado de la tabla en un componente separado */}
      {!cargando && !error && <InventoryTable items={filteredItems} />}
    </div>
  );
};

export default InventarioPage;
