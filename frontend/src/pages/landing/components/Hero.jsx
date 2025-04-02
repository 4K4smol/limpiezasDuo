import React from 'react';

function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="inicio" className="bg-limpio-light py-24 md:py-36"> {/* Fondo claro, más padding */}
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-limpio-dark mb-5 leading-tight">
          Limpieza Profesional <span className="text-limpio-gold">Impecable</span> en Cantabria
        </h1>
        <p className="text-lg md:text-xl text-limpio-gray max-w-3xl mx-auto mb-10">
          Portales, locales comerciales, oficinas y más. Dedicación y confianza para que tu espacio brille.
        </p>
        <button
          onClick={() => scrollToSection('contacto')}
          className="bg-limpio-gold text-white font-bold py-3 px-10 rounded-lg hover:bg-limpio-gold-dark transition duration-300 shadow-md transform hover:scale-105" // Botón dorado, texto blanco (o negro si prefieres), esquinas redondeadas
        >
          Solicitar Presupuesto
        </button>
      </div>
    </section>
  );
}

export default Hero;