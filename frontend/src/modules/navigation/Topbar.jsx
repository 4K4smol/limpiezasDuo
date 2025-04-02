import React from "react";
import { useAuth } from "../../hooks/useAuth";

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Panel de Control</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">{user?.name || "Usuario"}</span>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Topbar;
