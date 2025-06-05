import React, { useState, useEffect, useRef } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

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
        "sticky top-0 z-50 w-full bg-white border-b border-gray-100 transition-shadow duration-300",
        isScrolled ? "shadow-md" : "shadow-sm"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <a
              href="#inicio"
              onClick={(e) => scrollToSection('inicio', e)}
              className="flex items-center space-x-2"
              title="Ir al inicio"
            >
              <span className="text-2xl font-bold text-limpio-dark">
                Limpiezas<span className="text-limpio-gold">Duo</span>
              </span>


            </a>
          </div>

          <div className="hidden md:flex space-x-6">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(link.id, e)}
                className="text-gray-700 hover:text-limpio-gold transition font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-700 hover:text-limpio-gold"
            >
              {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white border-t border-gray-100">
          {navLinks.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => scrollToSection(link.id, e)}
              className="block text-gray-700 hover:text-limpio-gold py-2"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export default Header;
