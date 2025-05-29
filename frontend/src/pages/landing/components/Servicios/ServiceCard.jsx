import React, { useCallback, useMemo } from "react";
import PropTypes from 'prop-types'; // Opcional, para validación de props
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SparklesIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

/**
 * ServiceCard Component
 * 
 * A professional, accessible card component for displaying services with optional subservices.
 * Features smooth animations, keyboard navigation, and optimized performance.
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.servicio - Main service object with nombre and descripcion
 * @param {Array} [props.hijos=[]] - Array of subservice objects
 * @param {boolean} [props.isExpanded=false] - Whether the card is expanded to show subservices
 * @param {Function} props.onToggle - Callback function when card is toggled. Required if 'hijos' has items.
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ElementType} [props.customIcon] - Custom icon component to replace SparklesIcon
 */
const ServiceCard = React.memo(function ServiceCard({
  servicio,
  hijos = [],
  isExpanded = false,
  onToggle, // Consider making this optional if no hijos, or ensure it's always passed
  className,
  customIcon: CustomIcon,
}) {
  // Direct calculation, as hijos.length is cheap
  const hasSubservices = hijos.length > 0;
  const subserviceCount = hijos.length;

  const handleKeyPress = useCallback((event) => {
    if (!hasSubservices || !onToggle) return;
    
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  }, [hasSubservices, onToggle]); // onToggle should be memoized by parent

  const handleClick = useCallback(() => {
    if (hasSubservices && onToggle) {
      onToggle();
    }
  }, [hasSubservices, onToggle]); // onToggle should be memoized by parent

  const IconComponent = CustomIcon || SparklesIcon;

  return (
    <Card 
      className={classNames(
        "group transition-all duration-300 ease-out",
        "hover:shadow-xl hover:shadow-limpio-gold/5",
        "border border-gray-100 hover:border-limpio-gold/20",
        "bg-white backdrop-blur-sm",
        className
      )}
    >
      <CardHeader
        onClick={hasSubservices ? handleClick : undefined} // Only attach if interactive
        onKeyDown={hasSubservices ? handleKeyPress : undefined} // Only attach if interactive
        role={hasSubservices ? "button" : undefined}
        aria-expanded={hasSubservices ? isExpanded : undefined}
        aria-label={
          hasSubservices 
            ? `${servicio.nombre} - ${isExpanded ? 'Contraer' : 'Expandir'} para ${isExpanded ? 'ocultar' : 'mostrar'} ${subserviceCount} subservicios`
            : servicio.nombre
        }
        tabIndex={hasSubservices ? 0 : -1}
        className={classNames(
          "flex items-start gap-4 transition-all duration-200",
          hasSubservices && [
            "cursor-pointer",
            "hover:bg-gradient-to-r hover:from-limpio-gold/5 hover:to-transparent",
            "focus:outline-none focus:ring-2 focus:ring-limpio-gold/30 focus:ring-offset-2",
            "active:scale-[0.99]"
          ]
        )}
      >
        {/* Icon Container */}
        <div className={classNames(
          "flex-shrink-0 p-3 rounded-xl transition-all duration-300",
          "bg-gradient-to-br from-limpio-gold/10 to-limpio-gold/5",
          "group-hover:from-limpio-gold/15 group-hover:to-limpio-gold/10",
          "group-hover:shadow-lg group-hover:shadow-limpio-gold/10",
          hasSubservices && "group-hover:scale-105"
        )}>
          <IconComponent className="w-6 h-6 text-limpio-gold transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={classNames(
              "text-lg font-semibold text-limpio-dark leading-tight",
              "transition-colors duration-200",
              hasSubservices && "group-hover:text-limpio-gold"
            )}>
              {servicio.nombre}
            </h4>
            
            {hasSubservices && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-xs text-gray-500 font-medium">
                  {subserviceCount}
                </span>
                <ChevronDownIcon
                  className={classNames(
                    "w-5 h-5 text-gray-400 transition-all duration-300",
                    "group-hover:text-limpio-gold",
                    isExpanded && "rotate-180"
                  )}
                  aria-hidden="true" // Icon is decorative
                />
              </div>
            )}
          </div>
          
          {servicio.descripcion && (
            <p className="text-sm text-limpio-gray leading-relaxed pr-2">
              {servicio.descripcion}
            </p>
          )}
          
          {hasSubservices && (
            <div className="flex items-center gap-2 pt-1" aria-hidden="true"> {/* Decorative */}
              <div className="flex -space-x-1">
                {Array.from({ length: Math.min(3, subserviceCount) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-limpio-gold/30 border border-white"
                  />
                ))}
                {subserviceCount > 3 && (
                  <div className="w-2 h-2 rounded-full bg-gray-300 border border-white" />
                )}
              </div>
              <span className="text-xs text-gray-500">
                {isExpanded ? 'Ver menos' : 'Ver detalles'}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      {/* Expandable Content */}
      {hasSubservices && (
        <div
          id={`subservices-${servicio.nombre.replace(/\s+/g, '-').toLowerCase()}`} // Optional: for aria-controls
          className={classNames(
            "transition-all duration-300 ease-out overflow-hidden",
            isExpanded 
              ? "max-h-[500px] opacity-100" // Consider if 500px is always enough
              : "max-h-0 opacity-0"
          )}
          aria-hidden={!isExpanded}
        >
          <CardContent className={classNames(
            "pt-0 pb-6 px-6", // pt-0 might be specific to a design choice
            "bg-gradient-to-br from-gray-50/80 to-limpio-gold/5",
            "border-t border-gray-100/50"
          )}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-semibold text-limpio-dark flex items-center gap-2">
                  <span className="w-1 h-4 bg-limpio-gold rounded-full" aria-hidden="true"></span>
                  Servicios incluidos
                </h5>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                  {subserviceCount} servicio{subserviceCount !== 1 ? 's' : ''}
                </span>
              </div>
              
              <ul className="space-y-3" role="list">
                {hijos.map((sub, index) => (
                  <li 
                    key={sub.id || `subservice-${index}`} // Ensure key is unique
                    className={classNames(
                      "relative pl-6 py-2 rounded-lg transition-all duration-200",
                      "hover:bg-white/60 hover:shadow-sm"
                    )}
                    role="listitem"
                  >
                    <span 
                      className="absolute left-2 top-3 w-2 h-2 rounded-full bg-gradient-to-r from-limpio-gold to-limpio-gold/70"
                      aria-hidden="true"
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-800 leading-tight">
                        {sub.nombre}
                      </p>
                      {sub.descripcion && (
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {sub.descripcion}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </div>
      )}
    </Card>
  );
});

ServiceCard.displayName = 'ServiceCard';

// Optional: PropTypes for development-time validation
ServiceCard.propTypes = {
  servicio: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string
  }).isRequired,
  hijos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string
  })),
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func, // Technically only required if hasSubservices
  className: PropTypes.string,
  customIcon: PropTypes.elementType
};

ServiceCard.defaultProps = {
  hijos: [],
  isExpanded: false,
  // onToggle: () => {}, // Provide a no-op if it can be truly optional
  className: '',
  customIcon: null,
};


export default ServiceCard;