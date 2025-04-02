import React, { useState, useEffect, useRef, useCallback } from 'react';
import logo from '../../../../public/logo.png';
import { Link } from 'react-router-dom';
import { UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

// Define navigation links centrally
const navLinks = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'sobre-mi', label: 'Sobre Mí' },
  { id: 'contacto', label: 'Contacto' },
];

// --- Header Component ---
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null); // Ref for header height calculation

  // --- Scroll Effect ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Mobile Menu Body Scroll Lock ---
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // --- Smooth Scroll Function ---
  const scrollToSection = useCallback((id, event) => {
    event?.preventDefault();
    const targetElement = document.getElementById(id);
    // Read header height dynamically or use a fallback for large header
    const headerHeight = headerRef.current?.offsetHeight || 96; // Default to 96px (h-24)

    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    } else if (id === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMenuOpen(false); // Close menu after clicking
  }, []);

  return (
    <header
      ref={headerRef} // Attach ref to measure height
      className={classNames(
        "sticky top-0 z-50 w-full transition-shadow duration-300 ease-in-out bg-white",
        isScrolled ? "shadow-lg" : "shadow-md", // Slightly more pronounced shadow for large header
        "border-b border-gray-100" // Keep a subtle border
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
         {/* Increased height using h-24 (96px). Adjust if needed (e.g., h-28) */}
        <div className="flex justify-between items-center h-24">

          {/* LOGO - Larger */}
          <a
            href="#inicio"
            onClick={(e) => scrollToSection('inicio', e)}
            className="flex items-center space-x-4 flex-shrink-0" // Increased space
            title="Ir al inicio - LimpiezasDuo"
          >
            {/* Significantly larger logo */}
            <img
              src={logo}
              alt="Logo LimpiezasDuo"
              className="h-16 md:h-18 w-auto" // Increased size (e.g., 64px / 72px)
            />
            <span className="text-2xl md:text-3xl font-bold font-heading text-limpio-dark hidden sm:inline">
              Limpiezas<span className="text-limpio-gold">Duo</span>
            </span>
          </a>

          {/* MENÚ DESKTOP & LOGIN ICON CONTAINER */}
          <div className="hidden md:flex items-center flex-grow"> {/* Added flex-grow here */}

             {/* Main Navigation Links - Centered or spaced as desired */}
             {/* Using ml-auto on the wrapper below pushes it away from the logo */}
             {/* Using mr-auto on the wrapper below pushes login icon far right */}
             <div className="flex items-center space-x-4 lg:space-x-6 ml-auto mr-6 lg:mr-10"> {/* Added mr and ml-auto */}
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => scrollToSection(link.id, e)}
                    className={classNames(
                      "px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out",
                      'text-gray-600 hover:text-limpio-gold', // Simple hover effect
                    )}
                  >
                    {link.label}
                  </a>
                ))}
             </div>

            {/* Login Link - Pushed to the far right */}
            {/* It's inside the main flex container but outside the nav links group */}
            {/* ml-auto is NOT needed here because the nav group already has mr-auto */}
            <Link
              to="/login"
              className="p-2 rounded-full text-gray-500 hover:text-limpio-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-limpio-gold transition-colors duration-200"
              title="Acceder / Mi Cuenta"
            >
              <span className="sr-only">Acceder / Mi Cuenta</span>
              <UserIcon className="h-6 w-6" /> {/* Standard size icon */}
            </Link>
          </div>


          {/* BOTÓN HAMBURGUESA MÓVIL */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-limpio-gold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-limpio-gold"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              {menuOpen ? (
                <XMarkIcon className="block h-7 w-7" aria-hidden="true" /> // Slightly larger icons for larger header
              ) : (
                <Bars3Icon className="block h-7 w-7" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MENÚ MÓVIL - Overlay Style */}
      <div
          className={classNames(
              "md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out origin-top border-t border-gray-100",
              menuOpen ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0 pointer-events-none'
          )}
          id="mobile-menu"
      >
         <div className="px-4 pt-4 pb-5 space-y-2"> {/* Adjusted spacing */}
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(link.id, e)}
                className={classNames(
                  "block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200",
                   'text-gray-700 hover:text-limpio-dark hover:bg-gray-50' // Simple hover
                )}
              >
                {link.label}
              </a>
            ))}
            {/* Mobile Login Link */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-limpio-dark hover:bg-gray-50 transition-colors duration-200"
              >
                <UserIcon className="h-6 w-6 mr-3 text-gray-500" /> {/* Standard icon */}
                Acceder / Mi Cuenta
              </Link>
            </div>
         </div>
       </div>
    </header>
  );
}

export default Header;