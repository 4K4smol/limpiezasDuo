import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from '../../../services/axios';
import { Package, AlertTriangle, CheckCircle2 } from 'lucide-react';

import InventarioForm from '../components/InventarioForm';
import InventoryTable from '../components/InventoryTable';
import InventarioToolbar from '../components/InventarioToolbar';

// ============================
// Notification
// ============================
const Notification = React.memo(({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
      title: 'Éxito',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: 'Error',
    },
  }[type];

  return (
    <div className={`fixed top-4 right-4 max-w-md w-full ${config.bg} border-l-4 rounded-md p-4 shadow-lg z-50 animate-slide-in-right`}>
      <div className="flex">
        {config.icon}
        <div className="ml-3">
          <p className={`text-sm font-semibold ${config.text}`}>{config.title}</p>
          <p className={`text-sm ${config.text}`}>{message}</p>
        </div>
        <button onClick={onClose} className={`ml-auto p-1.5 rounded-md ${config.text} hover:opacity-75 focus:outline-none`}>
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>
      </div>
    </div>
  );
});

// ============================
// Stats card
// ============================
const StatsCard = ({ icon, label, value, color = 'gray', highlight = false }) => {
  const bg = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    gray: 'bg-gray-100',
  }[color];

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex items-center transition-all hover:shadow-xl ${highlight ? 'border-l-4 border-red-500' : ''}`}>
      <div className={`p-3 rounded-full mr-4 ${bg}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-2xl font-semibold ${highlight ? 'text-red-600' : 'text-gray-800'}`}>{value}</p>
      </div>
    </div>
  );
};

// ============================
// Página principal de inventario
// ============================
export default function InventarioPage() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Notificación
  const showNotification = useCallback((message, type = 'success') => setNotification({ message, type }), []);
  const hideNotification = useCallback(() => setNotification(null), []);

  // Cargar items
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/inventario');
      setItems(data.data || []);
    } catch {
      showNotification('Error al cargar los items del inventario', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // Estadísticas
  const stats = useMemo(() => {
    const activeItems = items.filter(i => i.activo);
    const lowStock = activeItems.filter(i => i.cantidad_actual <= i.stock_minimo);
    return {
      total: items.length,
      active: activeItems.length,
      lowStock: lowStock.length,
    };
  }, [items]);

  // CRUD
  const createItem = useCallback(async item => {
    const { data } = await axios.post('/inventario', item);
    return data.data || data;
  }, []);

  const updateItem = useCallback(async (id, item) => {
    const { data } = await axios.put(`/inventario/${id}`, item);
    return data.data || data;
  }, []);

  const deleteItem = useCallback(async id => {
    await axios.delete(`/inventario/${id}`);
  }, []);

  const toggleItemStatus = useCallback(async id => {
    const { data } = await axios.post(`/inventario/${id}/toggle`);
    return data;
  }, []);

  // Handlers
  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = item => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = async id => {
    if (!window.confirm('¿Eliminar este ítem?')) return;
    setIsSubmitting(true);
    try {
      await deleteItem(id);
      setItems(prev => prev.filter(i => i.id_item !== id));
      showNotification('Ítem eliminado correctamente');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async id => {
    setIsSubmitting(true);
    try {
      const updated = await toggleItemStatus(id);
      setItems(prev => prev.map(i => (i.id_item === id ? { ...i, activo: updated.activo } : i)));
      showNotification(updated.message || 'Estado actualizado');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async formData => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        const updated = await updateItem(editingItem.id_item, formData);
        setItems(prev => prev.map(i => (i.id_item === updated.id_item ? { ...i, ...updated } : i)));
        showNotification('Ítem actualizado correctamente');
      } else {
        const created = await createItem(formData);
        setItems(prev => [...prev, created]);
        showNotification('Ítem creado correctamente');
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      showNotification(err.message || 'Error al guardar', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const exportToCSV = () => {
    if (!items.length) return showNotification('No hay datos para exportar', 'error');
    try {
      const csv = [
        ['ID', 'Nombre', 'Descripción', 'Cantidad Actual', 'Stock Mínimo', 'Unidad', 'Ubicación', 'Activo'],
        ...items.map(i => [
          i.id_item, i.nombre_item, i.descripcion || '', i.cantidad_actual,
          i.stock_minimo, i.unidad, i.ubicacion || '', i.activo ? 'Sí' : 'No',
        ]),
      ].map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');

      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `inventario_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);

      showNotification('Exportación completada');
    } catch {
      showNotification('Error al exportar', 'error');
    }
  };

  // Estilo animación notificación
  useEffect(() => {
    if (!document.getElementById('notif-anim-style')) {
      const style = document.createElement('style');
      style.id = 'notif-anim-style';
      style.textContent = `
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Render
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
            <Package className="w-8 h-8 mr-3 text-purple-600" />
            Sistema de Inventario
          </h1>
          <p className="text-gray-600">Administra y controla los ítems de forma eficiente.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard label="Items Totales" color="blue" icon={<Package className="w-7 h-7 text-blue-600" />} value={stats.total} />
          <StatsCard label="Items Activos" color="green" icon={<CheckCircle2 className="w-7 h-7 text-green-600" />} value={stats.active} />
          <StatsCard
            label="Bajo Stock (Activos)"
            color={stats.lowStock > 0 ? 'red' : 'yellow'}
            icon={<AlertTriangle className={`w-7 h-7 ${stats.lowStock > 0 ? 'text-red-600' : 'text-yellow-600'}`} />}
            value={stats.lowStock}
            highlight={stats.lowStock > 0}
          />
        </div>

        {/* Toolbar */}
        <InventarioToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          onExport={exportToCSV}
          onAddItem={handleAddItem}
          isLoading={isLoading || isSubmitting}
          itemCount={items.length}
        />

        {/* Formulario o Tabla */}
        {showForm ? (
          <div className="max-w-4xl mx-auto">
            <InventarioForm
              initialData={editingItem}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        ) : (
          <InventoryTable
            items={items}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onToggleStatus={handleToggleStatus}
            isLoading={isLoading || isSubmitting}
          />
        )}

        {/* Notificación */}
        {notification && (
          <Notification message={notification.message} type={notification.type} onClose={hideNotification} />
        )}
      </div>
    </div>
  );
}
