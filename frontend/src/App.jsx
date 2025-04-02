import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Importa tu proveedor de autenticación
import router from './router'; // Importa la configuración del router

function App() {
  return (
    <AuthProvider> {/* Envuelve todo en el proveedor de autenticación */}
      <RouterProvider router={router} /> {/* Provee el router a la aplicación */}
    </AuthProvider>
  );
}

export default App;