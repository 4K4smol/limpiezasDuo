import React from 'react';

import Header from './components/Header';
import Hero from './components/Hero';
import Servicios from './components/Servicios/Servicios';
import SobreMi from './components/SobreMi';
import Contacto from './components/Contacto';
import Footer from './components/Footer';

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Servicios />
        <SobreMi />
        {/* <TestimoniosSection /> */}
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;