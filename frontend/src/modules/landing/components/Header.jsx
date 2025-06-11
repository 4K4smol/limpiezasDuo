import React, { useState, useEffect, useRef } from 'react';
import { Bars3Icon, XMarkIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useTheme } from '../../../contexts/ThemeContext';

const navLinks = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'sobre-mi', label: 'Sobre Mí' },
  { id: 'contacto', label: 'Contacto' },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollToSection = (id, e) => {
    e?.preventDefault();
    const headerHeight = headerRef.current?.offsetHeight || 96;
    const target = document.getElementById(id);

    if (target) {
      const offset = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    } else if (id === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={classNames(
        "sticky top-0 z-50 w-full border-b transition-all duration-300 backdrop-blur",
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 shadow-md"
          : "bg-white/95 dark:bg-gray-900/95 shadow-sm"
      )}
    >
      <nav className="container mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#inicio"
          onClick={(e) => scrollToSection('inicio', e)}
          className="text-2xl font-extrabold text-limpio-dark dark:text-white flex items-center"
          title="Volver al inicio"
        >
          Limpiezas<span className="text-limpio-gold">Duo</span>
        </a>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => scrollToSection(link.id, e)}
              className="text-gray-700 dark:text-gray-300 font-medium hover:text-limpio-gold dark:hover:text-limpio-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-limpio-gold"
            >
              {link.label}
            </a>
          ))}

          {/* Modo oscuro */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded text-gray-700 dark:text-gray-300 hover:text-limpio-gold focus:outline-none focus:ring-2 focus:ring-limpio-gold"
            aria-label="Cambiar tema"
          >
            {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-limpio-gold focus:outline-none focus:ring-2 focus:ring-limpio-gold"
            aria-label="Cambiar tema"
          >
            {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Abrir menú"
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-limpio-gold focus:outline-none focus:ring-2 focus:ring-limpio-gold"
          >
            {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={classNames(
          "md:hidden bg-white dark:bg-gray-900 border-t transition-all duration-300 ease-in-out overflow-hidden",
          menuOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        )}
      >
        <div className="flex flex-col px-4 space-y-2">
          {navLinks.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => scrollToSection(link.id, e)}
              className="text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-limpio-gold"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;
