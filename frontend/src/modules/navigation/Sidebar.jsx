import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-purple-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Limpiezas Duo</h2>
      <nav className="flex flex-col gap-4">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "font-semibold text-yellow-300" : ""}>
          Dashboard
        </NavLink>
        <NavLink to="/inventario" className={({ isActive }) => isActive ? "font-semibold text-yellow-300" : ""}>
          Inventario
        </NavLink>
        <NavLink to="/clientes" className={({ isActive }) => isActive ? "font-semibold text-yellow-300" : ""}>
          Clientes
        </NavLink>
        <NavLink to="/ordenes-trabajo" className={({ isActive }) => isActive ? "font-semibold text-yellow-300" : ""}>
          Órdenes
        </NavLink>
        <NavLink to="/servicios-periodicos" className={({ isActive }) => isActive ? "font-semibold text-yellow-300" : ""}>
          Servicios periodicos
        </NavLink>
        <NavLink to="/facturas" className={({ isActive }) => isActive ? "font-semibold text-yellow-300" : ""}>
          Facturas
        </NavLink>
        {/* Puedes seguir añadiendo más enlaces aquí */}
      </nav>
    </aside>
  );
};

export default Sidebar;
