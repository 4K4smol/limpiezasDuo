import React, { useCallback } from "react";
import PropTypes from 'prop-types';
import classNames from "classnames";
import { SparklesIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const ServiceCard = React.memo(function ServiceCard({
  servicio,
  hijos = [],
  isExpanded = false,
  onToggle,
  className,
  customIcon: CustomIcon,
}) {
  const hasSubservices = hijos.length > 0;
  const subserviceCount = hijos.length;
  const Icon = CustomIcon || SparklesIcon;

  const handleToggle = useCallback(() => {
    if (hasSubservices && onToggle) onToggle();
  }, [hasSubservices, onToggle]);

  const handleKeyPress = useCallback((event) => {
    if ((event.key === "Enter" || event.key === " ") && hasSubservices && onToggle) {
      event.preventDefault();
      onToggle();
    }
  }, [hasSubservices, onToggle]);

  return (
    <Card
      className={classNames(
        "transition-all duration-300 group backdrop-blur-sm",
        "border border-gray-100 dark:border-gray-700",
        "bg-white dark:bg-gray-800 hover:shadow-lg hover:border-limpio-gold/30",
        className
      )}
    >
      <CardHeader
        onClick={hasSubservices ? handleToggle : undefined}
        onKeyDown={hasSubservices ? handleKeyPress : undefined}
        role={hasSubservices ? "button" : undefined}
        aria-expanded={hasSubservices ? isExpanded : undefined}
        tabIndex={hasSubservices ? 0 : -1}
        className={classNames(
          "flex items-start gap-4 cursor-pointer transition-colors",
          hasSubservices && "hover:bg-limpio-gold/5 focus:outline-none focus:ring-2 focus:ring-limpio-gold/30"
        )}
      >
        {/* Icono */}
        <div className="p-3 rounded-xl bg-limpio-gold/10 group-hover:bg-limpio-gold/20 transition">
          <Icon className="w-6 h-6 text-limpio-gold" />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-limpio-dark dark:text-white">
              {servicio.nombre}
            </h4>
            {hasSubservices && (
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                <span>{subserviceCount}</span>
                <ChevronDownIcon
                  className={classNames(
                    "w-5 h-5 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </div>
            )}
          </div>

          {servicio.descripcion && (
            <p className="text-sm text-limpio-gray dark:text-gray-300 leading-relaxed">
              {servicio.descripcion}
            </p>
          )}

          {hasSubservices && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-1">
              <div className="flex -space-x-1">
                {Array.from({ length: Math.min(3, subserviceCount) }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-limpio-gold/30 rounded-full border border-white dark:border-gray-800" />
                ))}
                {subserviceCount > 3 && <div className="w-2 h-2 bg-gray-300 rounded-full border border-white" />}
              </div>
              <span>{isExpanded ? 'Ver menos' : 'Ver detalles'}</span>
            </div>
          )}
        </div>
      </CardHeader>

      {/* Contenido expandido */}
      {hasSubservices && (
        <div
          id={`subservices-${servicio.nombre.replace(/\s+/g, '-').toLowerCase()}`}
          className={classNames(
            "transition-all duration-300 overflow-hidden",
            isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          )}
          aria-hidden={!isExpanded}
        >
          <CardContent className="px-6 pt-0 pb-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="text-sm font-semibold text-limpio-dark dark:text-white flex items-center gap-2">
                  <span className="w-1 h-4 bg-limpio-gold rounded-full" />
                  Servicios incluidos
                </h5>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-2 py-1 rounded-full">
                  {subserviceCount} servicio{subserviceCount !== 1 ? 's' : ''}
                </span>
              </div>

              <ul className="space-y-3">
                {hijos.map((sub, i) => (
                  <li key={sub.id || i} className="relative pl-6 py-2 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700 transition">
                    <span className="absolute left-2 top-3 w-2 h-2 rounded-full bg-limpio-gold" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{sub.nombre}</p>
                      {sub.descripcion && (
                        <p className="text-xs text-gray-600 dark:text-gray-300">{sub.descripcion}</p>
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

ServiceCard.propTypes = {
  servicio: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
  }).isRequired,
  hijos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
  })),
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func,
  className: PropTypes.string,
  customIcon: PropTypes.elementType,
};

ServiceCard.defaultProps = {
  hijos: [],
  isExpanded: false,
  className: '',
  customIcon: null,
};

export default ServiceCard;
