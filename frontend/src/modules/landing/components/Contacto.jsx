import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

function Contacto() {
  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Formulario enviado (simulación).');
  };

  return (
    <section id="contacto" className="py-20 bg-limpio-light dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-limpio-dark dark:text-white mb-14">
          Contacta con Nosotros
        </h2>

        <div className="flex flex-col md:flex-row gap-10 md:gap-16">
          {/* Formulario */}
          <div className="md:w-1/2 lg:w-3/5">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md transition-colors">
              <p className="text-limpio-gray dark:text-gray-300 mb-6 text-lg">
                ¿Preguntas? ¿Necesitas un presupuesto? Rellena el formulario:
              </p>

              <div className="mb-5">
                <label htmlFor="nombre" className="block text-limpio-dark dark:text-white font-semibold mb-2">Nombre</label>
                <input type="text" id="nombre" name="nombre" required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-limpio-gold focus:border-transparent"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="email" className="block text-limpio-dark dark:text-white font-semibold mb-2">Correo Electrónico</label>
                <input type="email" id="email" name="email" required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-limpio-gold focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="mensaje" className="block text-limpio-dark dark:text-white font-semibold mb-2">Mensaje</label>
                <textarea id="mensaje" name="mensaje" rows="5" required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-limpio-gold focus:border-transparent"
                />
              </div>

              <button type="submit"
                className="w-full bg-limpio-gold text-white font-bold py-3 px-6 rounded-lg hover:bg-limpio-gold-dark transition duration-300 shadow-md transform hover:scale-105"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Información de contacto */}
          <div className="md:w-1/2 lg:w-2/5">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md h-full flex flex-col justify-center transition-colors">
              <h3 className="text-2xl font-heading font-semibold text-limpio-dark dark:text-white mb-6">Información de Contacto</h3>
              <div className="space-y-5">
                <p className="text-lg text-limpio-gray dark:text-gray-300 flex items-start">
                  <PhoneIcon className="h-6 w-6 mr-3 mt-1 text-limpio-gold flex-shrink-0" />
                  <span>
                    <strong>Teléfono / WhatsApp:</strong>
                    <a href="tel:+34XXXXXXXXX" className="ml-1 text-limpio-gold hover:underline break-all">+34 XXX XXX XXX</a>
                  </span>
                </p>
                <p className="text-lg text-limpio-gray dark:text-gray-300 flex items-start">
                  <EnvelopeIcon className="h-6 w-6 mr-3 mt-1 text-limpio-gold flex-shrink-0" />
                  <span>
                    <strong>Email:</strong>
                    <a href="mailto:info@limpiezasduo.com" className="ml-1 text-limpio-gold hover:underline break-all">info@limpiezasduo.com</a>
                  </span>
                </p>
                <p className="text-lg text-limpio-gray dark:text-gray-300 flex items-start">
                  <MapPinIcon className="h-6 w-6 mr-3 mt-1 text-limpio-gold flex-shrink-0" />
                  <span><strong>Zona de servicio:</strong> Torrelavega y alrededores (Cantabria)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contacto;
