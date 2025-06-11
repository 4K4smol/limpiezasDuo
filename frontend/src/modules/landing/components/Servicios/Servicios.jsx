import React, { useEffect, useState, useCallback } from "react";
import ServiceCard from "./ServiceCard";
import SkeletonCard from "./SkeletonCard";
import EmptyState from "./EmptyState";

// --- API Utils
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:8000/api';

const fetchServicios = async (signal) => {
  const res = await fetch(`${API_BASE}/servicios`, { signal });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState(null);

  const handleToggle = useCallback(
    (id) => setExpanded((prev) => (prev === id ? null : id)),
    []
  );

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
    <section id="servicios" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center font-heading text-limpio-dark dark:text-white mb-12 md:mb-16">
          Nuestros Servicios Profesionales
        </h2>

        {error && (
          <p className="text-center text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-md">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : serviciosActivos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {serviciosActivos.map((servicio) => (
              <ServiceCard
                key={servicio.id}
                servicio={servicio}
                hijos={(servicio.hijos || []).filter((h) => h.is_active)}
                isExpanded={expanded === servicio.id}
                onToggle={() => handleToggle(servicio.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Servicios;
