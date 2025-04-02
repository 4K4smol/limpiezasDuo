import React from 'react';
import { Outlet } from 'react-router-dom';
// Importa los componentes Header/Footer que ya tienes (pero quizás necesitas
// versiones específicas si son diferentes a los del área privada)
import Header from '../pages/landing/components/Header'; // Asegúrate que sea el correcto
import Footer from '../pages/landing/components/Footer'; // Asegúrate que sea el correcto

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <HeaderPublico /> Podrías tener uno específico o usar el mismo */}
      <main className="flex-grow">
        <Outlet /> {/* Aquí se renderiza LandingPage.jsx */}
      </main>
      {/* <FooterPublico /> */}
    </div>
  );
}
// Nota: Para tu caso de UNA sola página pública, LandingPage.jsx ya importa Header/Footer.
// Este Layout es más útil si tuvieras VARIAS páginas públicas (Inicio, Blog, Contacto).
// Si SOLO tienes LandingPage, puedes simplificar y no usar PublicLayout, poniendo LandingPage directamente en la ruta '/'.
// Sin embargo, mantenerlo puede ser útil para futuras expansiones.
// *** AJUSTE: Dado que LandingPage ya tiene Header/Footer, podemos hacer el Layout más simple: ***
export default function PublicLayoutSimple() {
    return <Outlet />; // Solo renderiza la página hija (LandingPage)
}

// *** USA PublicLayoutSimple en la config del router para la ruta '/' si LandingPage ya tiene su propio Header/Footer ***