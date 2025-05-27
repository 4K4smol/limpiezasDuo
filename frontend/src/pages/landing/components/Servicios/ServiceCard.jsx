import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SparklesIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

const ServiceCard = React.memo(function ServiceCard({
  servicio,
  hijos,
  isExpanded,
  onToggle,
}) {
  const hasSubservices = hijos.length > 0;

  return (
    <Card className="transition-shadow hover:shadow-xl">
      <CardHeader
        onClick={hasSubservices ? onToggle : undefined}
        role={hasSubservices ? "button" : undefined}
        aria-expanded={hasSubservices ? isExpanded : undefined}
        tabIndex={hasSubservices ? 0 : -1}
        className={classNames(
          "cursor-pointer flex items-start gap-4 group",
          hasSubservices && "hover:bg-gray-50"
        )}
        onKeyPress={hasSubservices
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onToggle();
            }
          : undefined}
      >
        <div className="flex-shrink-0 bg-limpio-gold/10 p-3 rounded-lg">
          <SparklesIcon className="w-6 h-6 text-limpio-gold" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="text-lg font-semibold text-limpio-dark">
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
      <div
        className={classNames(
          "transition-all duration-300 overflow-hidden",
          hasSubservices
            ? isExpanded
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0"
            : ""
        )}
      >
        {hasSubservices && (
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
        )}
      </div>
    </Card>
  );
});

export default ServiceCard;
