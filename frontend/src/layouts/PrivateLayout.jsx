import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../modules/navigation/Sidebar'; // Componente de barra lateral privada
import Topbar from '../modules/navigation/Topbar';   // Componente de barra superior privada

function PrivateLayout() {
  return (
    <div className="flex h-screen bg-limpio-light">
      <Sidebar /> {/* Barra lateral fija */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar /> {/* Barra superior */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-limpio-light p-6 md:p-8">
          <Outlet /> {/* Aquí se renderizan DashboardPage, ClientePage, etc. */}
        </main>
      </div>
    </div>
  );
}

export default PrivateLayout;