import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Hook para acceder al contexto
import Spinner from '../components/ui/Spinner'; // Un componente Spinner simple

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth(); // Obtiene estado del contexto
  const location = useLocation();

  if (isLoading) {
    // Muestra un spinner mientras se verifica el estado de autenticación
    // (útil si verificas token al inicio)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirige a /login
    // Guarda la ruta original para redirigir de vuelta después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, renderiza el contenido protegido (el Layout Privado y sus hijos)
  return children;
}

export default PrivateRoute;