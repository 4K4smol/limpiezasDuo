import React from 'react';

const FacturaPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-purple-800">Facturas</h1>

      <div className="bg-white rounded shadow p-4">
        <p className="text-gray-700">
          Aquí podrás gestionar todas las facturas: ver, crear, editar y descargar.
        </p>

        {/* Área para botones o futuras acciones */}
        <div className="mt-6">
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Nueva Factura
          </button>
        </div>

        {/* Área donde puedes meter una tabla de facturas en el futuro */}
        <div className="mt-6">
          <p className="text-gray-500 italic">Todavía no hay facturas creadas.</p>
        </div>
      </div>
    </div>
  );
};

export default FacturaPage;
