import React, { useEffect, useState } from "react";
import {
  SparklesIcon,
  ChevronDownIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";

/**
 * Utilidad para consumir la API de servicios con cancelación cuando el
 * componente se desmonta.
 */
const fetchServicios = async (signal) => {
  const res = await fetch("http://127.0.0.1:8000/api/servicios", { signal });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};

/** Skeleton ******************************************************/
const SkeletonCard = () => (
  <div className="animate-pulse">
    <Card className="h-48" />
  </div>
);

/** Empty‑state ***************************************************/
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
    <InformationCircleIcon className="w-10 h-10 text-gray-400 mb-4" />
    <h3 className="text-xl font-semibold text-gray-600">
      No hay servicios disponibles
    </h3>
    <p className="text-sm mt-2 text-gray-500">
      Por favor, contáctanos o vuelve a intentarlo más tarde.
    </p>
  </div>
);

/******************************************************************
 * TARJETA DE SERVICIO                                            *
 *****************************************************************/
const ServiceCard = ({ servicio, hijos, isExpanded, onToggle }) => {
  const hasSubservices = hijos.length > 0;

  const subVariants = {
    collapsed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1 },
  };

  return (
    <Card className="transition-shadow hover:shadow-xl">
      <CardHeader
        onClick={hasSubservices ? onToggle : undefined}
        role={hasSubservices ? "button" : undefined}
        aria-expanded={hasSubservices ? isExpanded : undefined}
        className={classNames(
          "cursor-pointer flex items-start gap-4 group",
          hasSubservices && "hover:bg-gray-50"
        )}
      >
        <div className="flex-shrink-0 bg-limpio-gold/10 p-3 rounded-lg">
          <SparklesIcon className="w-6 h-6 text-limpio-gold" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="text-lg font-semibold text-limpio-dark truncate">
            {servicio.nombre}
          </h4>
          {servicio.descripcion && (
            <p className="text-sm text-limpio-gray leading-relaxed">
              {servicio.descripcion}
            </p>
          )}
        </div>
        {hasSubservices && (
          <ChevronDownIcon
            className={classNames(
              "w-5 h-5 text-gray-400 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        )}
      </CardHeader>

      <AnimatePresence initial={false}>
        {hasSubservices && isExpanded && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={subVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <CardContent className="space-y-4 bg-gray-50/50 pt-4">
              <h5 className="text-sm font-semibold text-limpio-dark">
                Sub‑servicios incluidos
              </h5>
              <ul className="space-y-3">
                {hijos.map((sub) => (
                  <li key={sub.id} className="relative pl-5">
                    <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-limpio-gold/50" />
                    <p className="text-sm font-medium text-gray-800">
                      {sub.nombre}
                    </p>
                    {sub.descripcion && (
                      <p className="text-xs text-gray-600 mt-0.5">
                        {sub.descripcion}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

/******************************************************************
 * LISTADO DE SERVICIOS                                           *
 *****************************************************************/
const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    fetchServicios(controller.signal)
      .then((data) => {
        setServicios(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("No se pudieron cargar los servicios. Inténtalo de nuevo más tarde.");
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const serviciosActivos = servicios.filter((s) => s.is_active);

  return (
    <section id="servicios" className="py-16 md:py-24 bg-gray-50">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center font-heading text-limpio-dark mb-12 md:mb-16">
          Nuestros Servicios Profesionales
        </h2>

        {error && (
          <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">
            {error}
          </p>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <>
            {serviciosActivos.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
                {serviciosActivos.map((servicio) => (
                  <ServiceCard
                    key={servicio.id}
                    servicio={servicio}
                    hijos={(servicio.hijos || []).filter((h) => h.is_active)}
                    isExpanded={expanded === servicio.id}
                    onToggle={() =>
                      setExpanded((prev) => (prev === servicio.id ? null : servicio.id))
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Servicios;
