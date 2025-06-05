import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer
      className="bg-limpio-dark text-gray-300 py-10"
      aria-label="Pie de página"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Navegación interna */}
        <nav className="mb-6 space-x-6" aria-label="Navegación principal del sitio">
          <button
            onClick={() => scrollToSection('inicio')}
            className="hover:text-limpio-gold transition duration-200 focus:outline-none"
            aria-label="Ir a Inicio"
          >
            Inicio
          </button>
          <button
            onClick={() => scrollToSection('servicios')}
            className="hover:text-limpio-gold transition duration-200 focus:outline-none"
            aria-label="Ir a Servicios"
          >
            Servicios
          </button>
          <button
            onClick={() => scrollToSection('sobre-mi')}
            className="hover:text-limpio-gold transition duration-200 focus:outline-none"
            aria-label="Ir a Sobre mí"
          >
            Sobre mí
          </button>
          <button
            onClick={() => scrollToSection('contacto')}
            className="hover:text-limpio-gold transition duration-200 focus:outline-none"
            aria-label="Ir a Contacto"
          >
            Contacto
          </button>
        </nav>

        {/* Información de derechos y año dinámico */}
        <p className="text-sm mb-2">
          © {currentYear} LimpiezasDuo — [Tu Nombre / Nombre Fiscal]. Todos los derechos reservados.
        </p>
        
        {/* Enlaces legales u opcionales (descomentar si procede)
        <p className="text-xs text-gray-500">
          <a href="/politica-privacidad" className="hover:text-limpio-gold transition duration-200">
            Política de Privacidad
          </a>
          {" | "}
          <a href="/aviso-legal" className="hover:text-limpio-gold transition duration-200">
            Aviso Legal
          </a>
        </p>
        */}

        {/* Acceso privado */}
        <p className="mt-4 text-xs text-gray-500">
          <a
            href="/login"
            className="hover:text-limpio-gold transition duration-200 focus:outline-none"
            aria-label="Acceso privado"
          >
            Acceso privado
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
