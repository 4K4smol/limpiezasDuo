import React from 'react';
import logo from '../../../../public/logo.png'; // Asegúrate de tener también una versión oscura si es necesario

function Hero() {
  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="inicio"
      className="bg-limpio-light dark:bg-gray-900 py-24 md:py-36 text-center transition-colors duration-300"
      aria-labelledby="hero-title"
    >
      <div className="container mx-auto px-6">
        <h1
          id="hero-title"
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-limpio-dark dark:text-white mb-5 leading-tight"
        >
          Limpieza Profesional{' '}
          <span className="text-limpio-gold">Impecable</span> en Cantabria
        </h1>

        <p className="text-lg md:text-xl text-limpio-gray dark:text-gray-300 max-w-3xl mx-auto mb-10">
          Portales, locales comerciales, oficinas y más. Dedicación y confianza
          para que tu espacio brille.
        </p>

        <button
          type="button"
          onClick={() => handleScrollToSection('contacto')}
          className="bg-limpio-gold text-white font-bold py-3 px-10 rounded-lg hover:bg-limpio-gold-dark transition duration-300 shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-limpio-gold"
          aria-label="Desplazarse a la sección de contacto para solicitar presupuesto"
        >
          Solicitar Presupuesto
        </button>
      </div>

      <div className="mt-8">
        <img
          src={logo}
          alt="Logotipo de LimpiezasDuo"
          className="mx-auto w-48 md:w-64 lg:w-80 drop-shadow dark:brightness-110"
        />
      </div>
    </section>
  );
}

export default Hero;
