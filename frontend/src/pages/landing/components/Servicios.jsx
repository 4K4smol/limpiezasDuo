import React, { useEffect, useState } from 'react';
import {
  BuildingStorefrontIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  TrashIcon, // Consider if TrashIcon is appropriate, maybe replace?
  ChevronDownIcon,
  InformationCircleIcon // For empty state
} from '@heroicons/react/24/outline';
import classNames from 'classnames';

// --- Configuration ---
// Using a single default icon is often cleaner unless icons are meaningful per service
// If icons *should* be specific, it's best driven by API data (e.g., servicio.iconName)
const DefaultServiceIcon = SparklesIcon; // Cleaner default
// const iconList = [SparklesIcon, BuildingStorefrontIcon, BuildingOffice2Icon]; // Keep if cycling needed, but ensure enough icons or handle gracefully

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-limpio-gold"></div>
      {/* Optional: Add text */}
      {/* <p className="ml-4 text-limpio-gray">Cargando...</p> */}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center text-limpio-gray mt-10 py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
       <InformationCircleIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
       <p className="text-xl font-semibold text-gray-600">No hay servicios disponibles</p>
       <p className="text-sm mt-2 text-gray-500">Por favor, contacta con nosotros o vuelve a intentarlo más tarde.</p>
    </div>
  );
}


function ServiceCard({ servicio, hijos, isExpanded, onToggleExpand }) {
  // Decide which icon to use - default for now
  const Icono = DefaultServiceIcon;
  // Or if using the list: const Icono = iconList[index % iconList.length];

  const hasSubservices = hijos && hijos.length > 0;

  return (
    <div
      className={classNames(
        "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out",
        "hover:shadow-xl border border-gray-200", // Subtle border and enhanced hover
        // Optionally add scale on hover: "hover:scale-[1.02]" - use sparingly
      )}
    >
      {/* Clickable Header Area */}
      <div
        className={classNames(
          "p-6 cursor-pointer transition-colors duration-200",
          { "hover:bg-gray-50": hasSubservices }, // Indicate clickability slightly
          { "pb-4": isExpanded } // Reduce padding if expanded to connect visually
        )}
        onClick={hasSubservices ? onToggleExpand : undefined} // Only allow toggle if there are children
        role={hasSubservices ? "button" : undefined}
        aria-expanded={hasSubservices ? isExpanded : undefined}
      >
        <div className="flex items-start space-x-4">
          {/* Icon Styling */}
          <div className="flex-shrink-0 bg-limpio-gold/10 p-3 rounded-lg">
            <Icono className="h-8 w-8 text-limpio-gold" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
             <h3 className="text-lg font-semibold font-heading text-limpio-dark mb-1 truncate">
               {servicio.nombre}
             </h3>
             <p className="text-sm text-limpio-gray leading-relaxed">
               {servicio.descripcion}
             </p>
          </div>

          {/* Chevron Indicator (only if expandable) */}
          {hasSubservices && (
            <div className="flex-shrink-0 pt-1">
              <ChevronDownIcon
                className={classNames(
                  'h-5 w-5 text-gray-400 transition-transform duration-300 ease-in-out',
                  { 'rotate-180': isExpanded }
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* Subservices Section (Collapsible) */}
      {hasSubservices && (
        <div
          className={classNames(
            "transition-all duration-500 ease-in-out overflow-hidden",
            // Using max-height for smooth CSS transition
            isExpanded ? "max-h-[500px]" : "max-h-0" // Adjust max-height if needed
          )}
        >
          {/* Add a subtle separator */}
          <div className="border-t border-gray-200 mx-6"></div>

          <div className="px-6 pt-4 pb-6 bg-gray-50/50"> {/* Slightly different background for sublist */}
             <h4 className="text-sm font-semibold text-limpio-dark mb-3 ml-1">Sub-servicios incluidos:</h4>
             <ul className="space-y-3">
                {hijos.map((sub) => (
                  <li key={sub.id_servicio} className="relative pl-5">
                     {/* Bullet point style */}
                     <span className="absolute left-0 top-1 h-2 w-2 rounded-full bg-limpio-gold/50"></span>
                     <p className="text-sm font-medium text-gray-800">{sub.nombre}</p>
                     {sub.descripcion && (
                       <p className="text-xs text-gray-600 mt-0.5">{sub.descripcion}</p>
                     )}
                  </li>
                ))}
             </ul>
           </div>
        </div>
      )}
    </div>
  );
}


function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedServiceId, setExpandedServiceId] = useState(null);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    setIsLoading(true);
    setError(null); // Reset error on new fetch
    fetch('http://127.0.0.1:8000/api/servicios?all=true')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`); // Basic error handling
        }
        return res.json();
      })
      .then(data => {
        // Validate data structure slightly
        if (data && Array.isArray(data.data)) {
            setServicios(data.data);
        } else {
            console.warn("Received unexpected data format:", data);
            setServicios([]); // Set empty if format is wrong
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error cargando servicios:", err);
        setError("No se pudieron cargar los servicios. Inténtalo de nuevo más tarde."); // User-friendly error
        setIsLoading(false);
      });
  }, []);

  // --- Data Processing (Memoize if becomes complex) ---
  const padres = servicios.filter(s => s.servicio_padre_id === null);
  const hijosMap = React.useMemo(() => { // useMemo avoids recalculation on every render
      return servicios.reduce((acc, s) => {
          if (s.servicio_padre_id) {
            if (!acc[s.servicio_padre_id]) acc[s.servicio_padre_id] = [];
            acc[s.servicio_padre_id].push(s);
          }
          return acc;
        }, {});
  }, [servicios]); // Recalculate only when servicios changes


  const toggleExpand = (id) => {
    setExpandedServiceId(prev => (prev === id ? null : id));
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
        return <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</p>;
    }

    if (padres.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
        {padres.map((servicio) => (
          <ServiceCard
            key={servicio.id_servicio}
            servicio={servicio}
            hijos={hijosMap[servicio.id_servicio] || []}
            isExpanded={expandedServiceId === servicio.id_servicio}
            onToggleExpand={() => toggleExpand(servicio.id_servicio)}
            // Pass index if using iconList cycle: index={index}
          />
        ))}
      </div>
    );
  };

  return (
    <section id="servicios" className="py-16 md:py-24 bg-gray-50"> {/* Slightly off-white bg for contrast */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"> {/* Standard container */}
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-center text-limpio-dark mb-12 md:mb-16">
          Nuestros Servicios Profesionales
        </h2>

        {renderContent()}

      </div>
    </section>
  );
}

export default Servicios;