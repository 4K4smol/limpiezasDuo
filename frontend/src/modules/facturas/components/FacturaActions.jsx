import React, { useState, useEffect, useRef } from 'react';

export const FacturaActions = ({
  factura,
  onRectify,
  onPay,
  onDuplicate,
  onAnular,
  onDownload,
  onExportJSON
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
      >
        ⋮ Acciones
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 bg-white border rounded shadow-lg overflow-hidden text-sm">
          <button
            onClick={() => { setOpen(false); onDownload(factura.id_factura); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            📥 Descargar PDF
          </button>
          <button
            onClick={() => { setOpen(false); onExportJSON(factura.id_factura); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            🧾 Exportar JSON
          </button>

          {factura.anulada ? (
            <div className="px-4 py-2 text-xs text-red-600 font-medium italic bg-red-50 border-t border-gray-100">
              ❗ Esta factura ya está anulada
            </div>
          ) : (
            <>
              <button
                onClick={() => { setOpen(false); onPay(factura); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                💶 Registrar Pago
              </button>
              <button
                onClick={() => { setOpen(false); onRectify(factura); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                ↩️ Rectificar
              </button>
              <button
                onClick={() => { setOpen(false); onDuplicate(factura); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                📄 Duplicar
              </button>
              <button
                onClick={() => { setOpen(false); onAnular(factura); }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
              >
                ❌ Anular
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
