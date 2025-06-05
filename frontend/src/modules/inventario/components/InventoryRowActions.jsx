import React, { useState, useEffect, useRef } from 'react';

// ... (Tus componentes SVG Icon van aquí: EditIcon, MoreActionsIcon, ToggleStatusIcon, DeleteIcon)
// Por brevedad, los omito, pero deben estar definidos como en tu código anterior.
const EditIcon = () => (
    <svg className="w-3 h-3 mr-1.5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const MoreActionsIcon = () => (
    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);

const ToggleStatusIcon = ({ isActive }) => (
    <svg className={`w-4 h-4 ml-2 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-amber-500' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isActive ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m0-0L18.364 18.364M5.636 5.636L18.364 18.364" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
    </svg>
);

const DeleteIcon = () => (
    <svg className="w-4 h-4 ml-2 text-red-500 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


export default function InventoryRowActions({ item, onEdit, onToggleStatus, onDelete }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownClasses, setDropdownClasses] = useState('top-full mt-2 origin-top-right'); // Clases de posición y origen
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    const handleEdit = () => {
        onEdit(item);
    };

    const handleToggleStatus = () => {
        onToggleStatus(item.id_item);
        setShowDropdown(false);
    };

    const handleDelete = () => {
        onDelete(item.id_item);
        setShowDropdown(false);
    };

    const openDropdown = () => {
        if (triggerRef.current && dropdownRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const dropdownHeight = dropdownRef.current.offsetHeight; // Altura real del dropdown

            // Encuentra el contenedor scrollable más cercano o usa window
            let scrollableContainer = triggerRef.current.parentElement;
            while (scrollableContainer) {
                const style = window.getComputedStyle(scrollableContainer);
                if (style.overflowY === 'auto' || style.overflowY === 'scroll' || style.overflowX === 'auto' || style.overflowX === 'scroll') {
                    break;
                }
                if (scrollableContainer.tagName === 'BODY') { // Llegamos al body
                    scrollableContainer = window;
                    break;
                }
                scrollableContainer = scrollableContainer.parentElement;
            }
            if (!scrollableContainer) scrollableContainer = window; // Fallback

            const containerRect = (scrollableContainer === window)
                ? { top: 0, bottom: window.innerHeight, left: 0, right: window.innerWidth }
                : scrollableContainer.getBoundingClientRect();

            const spaceBelow = containerRect.bottom - triggerRect.bottom;
            const spaceAbove = triggerRect.top - containerRect.top;

            // Si no hay espacio abajo pero sí arriba, ábrelo hacia arriba
            if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                setDropdownClasses('bottom-full mb-2 origin-bottom-right'); // Dropup
            } else {
                setDropdownClasses('top-full mt-2 origin-top-right'); // Dropdown (default)
            }
        } else {
            // Fallback si los refs no están listos (poco probable si se renderiza el dropdown)
            setDropdownClasses('top-full mt-2 origin-top-right');
        }
        setShowDropdown(true);
    };

    const closeDropdown = () => {
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        if (showDropdown) {
            closeDropdown();
        } else {
            // Necesitamos que el dropdown esté en el DOM para medirlo antes de decidir la posición
            // Así que lo mostramos brevemente, medimos y luego actualizamos si es necesario.
            // O, si ya se ha renderizado una vez, la medición será más precisa.
            setShowDropdown(true); // Primero mostramos para que dropdownRef.current.offsetHeight tenga valor
        }
    };

    useEffect(() => {
        // Si acabamos de poner showDropdown a true para medir, ahora calculamos la posición
        if (showDropdown && dropdownRef.current && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const dropdownHeight = dropdownRef.current.offsetHeight;

            let scrollableParent = triggerRef.current.closest('.-mx-4.-my-2.overflow-x-auto') || // Clase específica de tu tabla
                triggerRef.current.closest('.overflow-x-auto') || // Genérico
                document.body; // Fallback

            const viewportHeight = window.innerHeight;
            const parentRect = scrollableParent.getBoundingClientRect();
            const parentBottom = (scrollableParent === document.body) ? viewportHeight : parentRect.bottom;
            const parentTop = (scrollableParent === document.body) ? 0 : parentRect.top;

            const spaceBelowTrigger = parentBottom - triggerRect.bottom;
            const spaceAboveTrigger = triggerRect.top - parentTop;

            let newPositionClasses = 'top-full mt-2 origin-top-right'; // Default

            if (spaceBelowTrigger < dropdownHeight && spaceAboveTrigger > dropdownHeight) {
                newPositionClasses = 'bottom-full mb-2 origin-bottom-right';
            }
            // Solo actualiza si es diferente para evitar re-renders innecesarios
            if (newPositionClasses !== dropdownClasses) {
                setDropdownClasses(newPositionClasses);
            }
        }

        // Click outside and Escape key logic
        if (!showDropdown) return;
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [showDropdown, dropdownClasses]); // Asegúrate de incluir dropdownClasses si lo modificas dentro

    const isActivo = item.activo;

    return (
        <div className="flex items-center justify-end gap-2">
            <button
                type="button"
                onClick={handleEdit}
                className="group inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 hover:shadow-sm"
                title={`Editar ${item.nombre_item}`}
            >
                <EditIcon />
                Editar
            </button>

            <div className="relative">
                <button
                    ref={triggerRef}
                    type="button"
                    id={`actions-menu-button-${item.id_item}`}
                    aria-haspopup="true"
                    aria-expanded={showDropdown}
                    aria-controls={showDropdown ? `actions-menu-${item.id_item}` : undefined}
                    onClick={toggleDropdown} // Usamos toggleDropdown
                    className="group inline-flex items-center p-2 text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 transition-all duration-200 hover:shadow-sm"
                    title="Más acciones"
                >
                    <MoreActionsIcon />
                </button>

                {/* El dropdown ahora se renderiza siempre para poder medirlo, pero su visibilidad se controla con opacity y pointer-events */}
                <div
                    ref={dropdownRef}
                    id={`actions-menu-${item.id_item}`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby={`actions-menu-button-${item.id_item}`}
                    className={`absolute right-0 w-56 bg-white border border-slate-200 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50
                                ${dropdownClasses} 
                                transition-opacity duration-200 ease-out
                                ${showDropdown ? 'opacity-100 pointer-events-auto animate-in' : 'opacity-0 pointer-events-none'
                        }
                                ${dropdownClasses.includes('bottom-full') && showDropdown ? 'slide-in-from-bottom-2' : ''}
                                ${dropdownClasses.includes('top-full') && showDropdown ? 'slide-in-from-top-2' : ''}
                              `}
                // Si usas tailwindcss-animate, las clases slide-in-* necesitan 'animate-in'
                >
                    {/* Solo renderiza el contenido interno si el dropdown debe mostrarse, para optimizar */}
                    {showDropdown && (
                        <>
                            <div className="py-2" role="none">
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleToggleStatus}
                                    className={`group w-full flex items-center px-4 py-2.5 text-sm transition-all duration-200 hover:bg-slate-50 ${isActivo
                                        ? 'text-amber-700 hover:text-amber-800 hover:bg-amber-50'
                                        : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50'
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full mr-3 transition-all duration-200 group-hover:scale-125 ${isActivo ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`}></span>
                                    <span className="flex-1 text-left">
                                        <span className="font-medium block">
                                            {isActivo ? 'Desactivar' : 'Activar'}
                                        </span>
                                        <span className="text-xs text-slate-500 block mt-0.5">
                                            {isActivo ? 'Marcar como inactivo' : 'Marcar como activo'}
                                        </span>
                                    </span>
                                    <ToggleStatusIcon isActive={isActivo} />
                                </button>

                                <div className="border-t border-slate-100 my-1 mx-2"></div>

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleDelete}
                                    className="group w-full flex items-center px-4 py-2.5 text-sm text-red-700 hover:text-red-800 hover:bg-red-50 transition-all duration-200"
                                >
                                    <span className="w-2 h-2 rounded-full bg-red-500 mr-3 transition-all duration-200 group-hover:scale-125"></span>
                                    <span className="flex-1 text-left">
                                        <span className="font-medium block">Eliminar</span>
                                        <span className="text-xs text-slate-500 block mt-0.5">
                                            Borrar permanentemente
                                        </span>
                                    </span>
                                    <DeleteIcon />
                                </button>
                            </div>

                            <div className="border-t border-slate-100 px-4 py-2 bg-slate-50/70 rounded-b-xl">
                                <p className="text-xs text-slate-500 font-medium truncate">
                                    ID: {item.id_item} • {item.nombre_item}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}