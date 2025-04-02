import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import PrivateLayout from '../layouts/PrivateLayout';
import LandingPage from '../pages/landing/LandingPage';
import LoginPage from '../modules/auth/LoginPage';
import DashboardPage from '../modules/dashboard/DashboardPage';
import ClientePage from '../modules/clientes/ClientePage';
import FacturaPage from '../modules/facturas/FacturaPage';
// ... importar otras páginas de módulos privados
import PrivateRoute from './PrivateRoute'; // El componente que protege rutas
import NotFoundPage from '../pages/NotFoundPage';

const router = createBrowserRouter([
  // --- Rutas Públicas ---
  {
    element: <PublicLayout />, // Layout para todas las rutas públicas anidadas
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      // Puedes añadir otras páginas públicas aquí si las necesitas (ej. /politica-privacidad)
    ],
  },
  // --- Ruta de Login (Pública pero separada) ---
  {
    path: '/login',
    element: <LoginPage />, // Sin layout o con uno específico si quieres
  },

  // --- Rutas Privadas ---
  {
    element: (
      <PrivateRoute> {/* Envuelve el layout privado */}
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/dashboard', // Ruta base del área privada
        element: <DashboardPage />,
      },
      {
        path: '/clientes',
        element: <ClientePage />,
        // Puedes tener rutas anidadas aquí: /clientes/:id, /clientes/nuevo
      },
      {
        path: '/facturas',
        element: <FacturaPage />,
      },
      // ... otras rutas privadas para cada módulo (ordenes, empleados, etc.)
      {
        path: '/ordenes-trabajo',
        // element: <OrdenTrabajoPage />,
      },
      {
         path: '/empleados',
         // element: <EmpleadoPage />,
      }
    ],
  },
  {
    path: '*',
    element: <NotFoundPage/>
  }
]);

export default router;