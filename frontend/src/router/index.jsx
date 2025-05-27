import React from "react";
import { createBrowserRouter } from "react-router-dom";

/* ---- Layouts ---- */
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";

/* ---- Auth / wrappers ---- */
import PrivateRoute from "./PrivateRoute";

/* ---- Páginas genéricas ---- */
import NotFoundPage from "../pages/NotFoundPage";

/* ---- Lazy‑loaded vistas públicas ---- */
const LandingPage = React.lazy(() => import("../pages/landing/LandingPage"));
const LoginPage = React.lazy(() => import("../modules/auth/LoginPage"));

/* ---- Lazy‑loaded vistas privadas ---- */
const DashboardPage = React.lazy(() => import("../modules/dashboard/DashboardPage"));
const InventarioPage = React.lazy(() => import("../modules/inventario/InventarioPage"));
const ClientePage = React.lazy(() => import("../modules/clientes/ClientePage"));
const FacturaPage = React.lazy(() => import("../modules/facturas/FacturaPage"));

/* Órdenes puntuales */
const OrdenTrabajoPage = React.lazy(() => import("../modules/ordenesTrabajo/OrdenTrabajoPage"));
const NuevaOrden = React.lazy(() => import("../modules/ordenesTrabajo/components/NuevaOrden"));

/* Servicios periódicos */
const ServicioPeriodicoPage = React.lazy(() => import("../modules/serviciosPeriodicos/ServicioPeriodicoPage"));
const NuevoServicioPeriodico = React.lazy(() => import("../modules/serviciosPeriodicos/components/NuevoServicioPeriodico"));

/* ----------------------------------------------------------------------------- */
/* Rutas                                                                           */
/* ----------------------------------------------------------------------------- */

/**
 * Estructura anidada para mantener cada sub‑módulo agrupado.  
 * Las rutas públicas carecen de protección.  
 * Las rutas privadas se engloban dentro de <PrivateRoute> + PrivateLayout.
 */
export const router = createBrowserRouter([
  /* ----------------------------- Rutas públicas ----------------------------- */
  {
    element: <PublicLayout />,          // Layout "light" sin barra lateral
    children: [
      { path: "/", element: <LandingPage /> },
    ],
  },

  { path: "/login", element: <LoginPage /> },

  /* ----------------------------- Rutas privadas ----------------------------- */
  {
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/inventario", element: <InventarioPage /> },
      { path: "/clientes", element: <ClientePage /> },
      { path: "/facturas", element: <FacturaPage /> },

      /* ---- Órdenes puntuales ---- */
      {
        path: "/ordenes-trabajo",
        children: [
          { index: true, element: <OrdenTrabajoPage /> },   // /ordenes-trabajo
          { path: "nueva", element: <NuevaOrden /> },      // /ordenes-trabajo/nueva
        ],
      },

      /* ---- Servicios periódicos ---- */
      {
        path: "/servicios-periodicos",
        children: [
          { index: true, element: <ServicioPeriodicoPage /> },
          { path: "nuevo", element: <NuevoServicioPeriodico /> },  // /servicios-periodicos/nuevo
        ],
      },
    ],
  },

  /* ----------------------------- 404 ----------------------------- */
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
