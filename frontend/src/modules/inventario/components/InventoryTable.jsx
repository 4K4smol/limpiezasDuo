import React, { useMemo } from 'react';
import InventoryRowActions from './InventoryRowActions';

export default function InventoryTable({
  items = [],
  searchTerm = '',
  filterStatus = 'all',
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false
}) {
  const filteredItems = useMemo(() => {
    // ... (filtering logic remains the same)
    let data = [...items];
    if (filterStatus === 'active') data = data.filter(i => i.activo);
    if (filterStatus === 'inactive') data = data.filter(i => !i.activo);
    if (filterStatus === 'low') data = data.filter(i => i.activo && i.cantidad_actual <= i.stock_minimo);
    
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      data = data.filter(i =>
        i.nombre_item?.toLowerCase().includes(s) ||
        i.descripcion?.toLowerCase().includes(s) ||
        i.ubicacion?.toLowerCase().includes(s)
      );
    }
    return data;
  }, [items, filterStatus, searchTerm]);

  const tableHeaders = [
    { key: 'nombre_item', label: 'Nombre', className: 'w-1/5 min-w-[180px]' },
    { key: 'descripcion', label: 'Descripción', className: 'w-2/5 min-w-[250px] whitespace-normal' }, // Added whitespace-normal
    { key: 'cantidad_actual', label: 'Cantidad', className: 'text-right' },
    { key: 'stock_minimo', label: 'Stock Mínimo', className: 'text-right' },
    { key: 'unidad', label: 'Unidad' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'activo', label: 'Estado', className: 'text-center' },
    // MODIFIED: Actions column header
    { key: 'acciones', label: 'Acciones', className: 'text-right w-[130px] lg:w-[150px]' }, // Adjusted width and alignment
  ];

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {tableHeaders.map(header => (
                    <th
                      key={header.key}
                      scope="col"
                      // MODIFIED: Added sm:pr-6 for the last header if it's 'acciones'
                      className={`py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:pl-6 ${header.className || ''} ${header.key === 'acciones' ? 'sm:pr-6' : ''}`}
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  // ... (isLoading state remains the same)
                  <tr>
                    <td colSpan={tableHeaders.length} className="whitespace-nowrap px-6 py-12 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cargando items...
                      </div>
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  // ... (empty state remains the same)
                  <tr>
                    <td colSpan={tableHeaders.length} className="whitespace-nowrap px-6 py-12 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400 mb-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
                        </svg>
                        No hay items que coincidan con la búsqueda o el filtro.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id_item}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {item.nombre_item || 'N/A'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl break-words" title={item.descripcion}>
                        {item.descripcion || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                        <span className={item.cantidad_actual <= item.stock_minimo && item.activo ? 'text-red-600 font-bold' : 'text-gray-700'}>
                          {item.cantidad_actual}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                        {item.stock_minimo}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.unidad || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.ubicacion || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset 
                          ${item.activo 
                            ? 'bg-green-50 text-green-700 ring-green-600/20' 
                            : 'bg-gray-50 text-gray-600 ring-gray-500/10'}`}>
                          {item.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      {/* MODIFIED: Actions cell */}
                      <td className="py-4 pl-3 pr-4 text-sm font-medium text-right sm:pr-6">
                        {/* No whitespace-nowrap here, allow InventoryRowActions to manage its layout */}
                        <InventoryRowActions
                          item={item}
                          onEdit={onEdit}
                          onToggleStatus={onToggleStatus}
                          onDelete={onDelete}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}