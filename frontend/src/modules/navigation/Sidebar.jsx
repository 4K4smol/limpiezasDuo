import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ closeSidebar }) => {
  return (
    <aside className="w-64 h-full bg-purple-800 text-white p-4 shadow-lg md:static md:translate-x-0 fixed top-0 left-0 z-50 transition-transform transform">
      {/* Botón para cerrar en móviles */}
      {closeSidebar && (
        <button
          onClick={closeSidebar}
          className="md:hidden mb-4 text-white text-right w-full"
        >
          ✕ Cerrar
        </button>
      )}

      <h2 className="text-2xl font-bold mb-6">Limpiezas Duo</h2>
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "font-semibold text-yellow-300" : ""
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/inventario"
          className={({ isActive }) =>
            isActive ? "font-semibold text-yellow-300" : ""
          }
        >
          Inventario
        </NavLink>
        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            isActive ? "font-semibold text-yellow-300" : ""
          }
        >
          Clientes
        </NavLink>
        <NavLink
          to="/ordenes-trabajo"
          className={({ isActive }) =>
            isActive ? "font-semibold text-yellow-300" : ""
          }
        >
          Órdenes
        </NavLink>
        <NavLink
          to="/servicios-periodicos"
          className={({ isActive }) =>
            isActive ? "font-semibold text-yellow-300" : ""
          }
        >
          Servicios periódicos
        </NavLink>
        <NavLink
          to="/facturas"
          className={({ isActive }) =>
            isActive ? "font-semibold text-yellow-300" : ""
          }
        >
          Facturas
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
