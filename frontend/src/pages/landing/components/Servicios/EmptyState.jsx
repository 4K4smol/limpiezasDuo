import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

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

export default EmptyState;
