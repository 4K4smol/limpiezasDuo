import React from "react";
import { useAuth } from "../../hooks/useAuth";

const Topbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow px-4 md:px-6 py-4 flex items-center justify-between">
      {/* Botón menú hamburguesa en móviles */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={toggleSidebar}
        aria-label="Abrir menú lateral"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Título centrado en móviles, alineado en pantallas grandes */}
      <h1 className="text-lg md:text-xl font-bold text-gray-800">Panel de Control</h1>

      {/* Info de usuario y logout */}
      <div className="flex items-center gap-4">
        <span
          className="text-gray-700 text-sm md:text-base truncate max-w-[8rem] md:max-w-none"
          title={user?.name}
        >
          {user?.name || "Usuario"}
        </span>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Topbar;
