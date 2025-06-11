import React from 'react';

import Header from '../components/Header';
import Hero from '../components/Hero';
import Servicios from '../components/Servicios/Servicios';
import SobreMi from '../components/SobreMi';
import Contacto from '../components/Contacto';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Hero />
        <section id="servicios"><Servicios /></section>
        <section id="sobre-mi"><SobreMi /></section>
        {/* <TestimoniosSection /> */}
        <section id="contacto"><Contacto /></section>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;