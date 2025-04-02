import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
      <Link
        to="/"
        className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;
