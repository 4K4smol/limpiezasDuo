// src/modules/clientes/pages/ClientePage.jsx

import React, { useEffect, useState } from 'react';
import { clienteService } from '../services/clienteService';
import ClientForm from '../components/ClientForm';
import { Pencil, Trash2, ToggleLeft, ToggleRight, Plus } from 'lucide-react';

export default function ClientePage() {
  const [clientes, setClientes] = useState([]);
  const [query, setQuery] = useState('');
  const [dialog, setDialog] = useState({ open: false, data: null });

  const loadClientes = () =>
    clienteService.list().then(setClientes).catch(console.error);

  useEffect(() => {
    loadClientes();
  }, []);

  const openNew = () => setDialog({ open: true, data: null });
  const openEdit = (cliente) => setDialog({ open: true, data: cliente });
  const closeForm = () => setDialog({ open: false, data: null });

  const saveCliente = (data) => {
    const action = data.id_cliente
      ? clienteService.update(data.id_cliente, data)
      : clienteService.create(data);
    action.then(() => {
      loadClientes();
      closeForm();
    });
  };

  const deleteCliente = (id) => {
    if (confirm('¿Eliminar cliente definitivamente?')) {
      clienteService.remove(id).then(loadClientes);
    }
  };

  const toggleActivo = (id) => clienteService.toggle(id).then(loadClientes);

  const clientesFiltrados = clientes.filter((c) =>
    (c.razon_social ?? '').toLowerCase().includes(query.toLowerCase()) ||
    (c.cif ?? '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="p-6 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <div className="flex gap-3">
          <input
            type="search"
            placeholder="Buscar…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded-xl px-3 py-2"
          />
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl"
          >
            <Plus size={18} /> Nuevo
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border rounded-2xl">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Razón social</th>
              <th className="p-3">CIF</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Email</th>
              <th className="p-3">Ciudad</th>
              <th className="p-3 text-center">Activo</th>
              <th className="p-3 w-32">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((c) => (
                <tr key={c.id_cliente} className="border-t hover:bg-gray-50">
                  <td className="p-3">{c.razon_social}</td>
                  <td className="p-3">{c.cif}</td>
                  <td className="p-3">{c.telefono}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.ciudad}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleActivo(c.id_cliente)}
                      className="inline-flex"
                    >
                      {c.activo ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => deleteCliente(c.id_cliente)}
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No hay clientes que coincidan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ClientForm
        open={dialog.open}
        onClose={closeForm}
        onSave={saveCliente}
        initialValues={dialog.data}
      />
    </section>
  );
}
