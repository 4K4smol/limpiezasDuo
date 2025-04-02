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
    <footer className="bg-limpio-dark text-gray-300 py-10"> {/* Fondo oscuro */}
      <div className="container mx-auto px-6 text-center">
        <div className="mb-6 space-x-6">
             <button onClick={() => scrollToSection('inicio')} className="hover:text-limpio-gold transition duration-200">Inicio</button>
            <button onClick={() => scrollToSection('servicios')} className="hover:text-limpio-gold transition duration-200">Servicios</button>
            <button onClick={() => scrollToSection('sobre-mi')} className="hover:text-limpio-gold transition duration-200">Sobre mí</button>
            <button onClick={() => scrollToSection('contacto')} className="hover:text-limpio-gold transition duration-200">Contacto</button>
        </div>
        {/* Redes Sociales (opcional) */}
        {/* <div className="mb-6"> ... </div> */}
        <p className="text-sm mb-2">
          © {currentYear} LimpiezasDuo - [Tu Nombre o Nombre Fiscal] - Todos los derechos reservados.
        </p>
         <p className="text-xs text-gray-500">
            {/* Enlaces legales si son necesarios */}
            {/* <a href="/politica-privacidad" className="hover:text-limpio-gold">Política de Privacidad</a> |
            <a href="/aviso-legal" className="hover:text-limpio-gold">Aviso Legal</a> */}
         </p>
      </div>
    </footer>
  );
}

export default Footer;