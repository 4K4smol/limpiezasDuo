import React from 'react';
import logo from '../../../../public/logo.png' // asegúrate que el archivo existe y tiene esa extensión

function SobreMi() {
  return (
    <section id="sobre-mi" className="py-20 bg-limpio-light">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-16">
        
        {/* Texto descriptivo */}
        <div className='md:w-2/3'>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-limpio-dark mb-6">
            Conoce a <span className="text-limpio-gold">LimpiezasDuo</span>
          </h2>
          <p className="text-lg text-limpio-gray mb-4 leading-relaxed">
            ¡Hola! Soy [Tu Nombre], la cara detrás de LimpiezasDuo. Con [X] años dedicados al sector de la limpieza profesional en Cantabria, mi pasión es transformar espacios y ofrecer un servicio de máxima confianza.
          </p>
          <p className="text-lg text-limpio-gray leading-relaxed">
            Mi compromiso es la atención al detalle, la eficiencia y la cercanía con cada cliente. Me encargo personalmente de que tu portal, local u oficina esté siempre impecable, utilizando productos de calidad y adaptándome a tus horarios. Tu tranquilidad es mi prioridad.
          </p>
        </div>

        {/* Imagen del logo sola y centrada */}
        <div className='md:w-1/3 flex justify-center'>
          <img src={logo} alt="Logo LimpiezasDuo" className="w-40 md:w-52 object-contain" />
        </div>
      </div>
    </section>
  );
}

export default SobreMi;
