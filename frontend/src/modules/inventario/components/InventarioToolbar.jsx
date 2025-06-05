import React from 'react';
import { Search, Filter, Plus, Download } from 'lucide-react';

export default function InventarioToolbar({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  onExport,
  onAddItem,
  isLoading,
  itemCount,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Buscar */}
        <div className="relative flex-grow md:max-w-md">
          <input
            type="text"
            placeholder="Buscar por nombre, descripción, ubicación..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="low">Bajo stock</option>
          </select>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-sm font-medium"
            disabled={isLoading || itemCount === 0}
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>

          <button
            onClick={onAddItem}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium shadow"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
            Añadir ítem
          </button>
        </div>
      </div>
    </div>
  );
}
