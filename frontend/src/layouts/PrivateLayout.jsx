import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../modules/navigation/Sidebar";
import Topbar from "../modules/navigation/Topbar";

function PrivateLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-limpio-light overflow-hidden">
      {/* Sidebar fijo en escritorio */}
      <aside className="hidden md:flex">
        <Sidebar />
      </aside>

      {/* Sidebar móvil (overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Fondo semitransparente */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Panel lateral */}
          <div className="relative z-50 w-64 bg-white shadow-lg h-full">
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PrivateLayout;
