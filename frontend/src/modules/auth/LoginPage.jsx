import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Añadido Link por si quieres enlace a landing
import { useAuth } from '../../hooks/useAuth'; // Hook para acceder al contexto
// Opcional: Importar un componente Spinner si tienes uno genérico
// import Spinner from '../../components/ui/Spinner';

function LoginPage() {
  // --- Estados del Componente ---
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Hooks y Contexto ---
  const { login } = useAuth(); // Obtiene la función login del AuthContext
  const navigate = useNavigate();
  const location = useLocation();

  // Determina a dónde redirigir después del login exitoso
  // Si el usuario intentó acceder a una ruta privada, 'location.state.from' tendrá esa ruta
  // Si no, redirige al dashboard por defecto
  const from = location.state?.from?.pathname || '/dashboard';

  // --- Manejador del Envío del Formulario ---
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene la recarga de la página
    setError(null);       // Limpia errores previos
    setIsLoading(true);   // Activa el estado de carga

    try {
      // Llama a la función login del contexto con las credenciales
      // Asegúrate de que el objeto coincide con lo que espera tu API/AuthContext
      await login({ nombre_usuario: nombreUsuario, password: password });

      // Si login() no lanza error, la autenticación fue exitosa
      console.log(`Login exitoso, redirigiendo a: ${from}`);
      navigate(from, { replace: true }); // Redirige al usuario, 'replace' evita que pueda volver al login con el botón "atrás"

    } catch (err) {
      // Si login() lanza un error (ya sea de la API o validación), lo capturamos
      console.error("Error durante el login:", err);
      setError(err.message || 'Error desconocido. Inténtalo de nuevo.'); // Muestra el mensaje de error
    } finally {
      setIsLoading(false); // Desactiva el estado de carga, haya éxito o error
    }
  };

  // --- Renderizado del Componente ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4"> {/* Fondo sutil */}
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200"> {/* Tarjeta de login */}

        {/* Logo/Título */}
        <div className="text-center">
           {/* Puedes poner tu logo aquí */}
           {/* <img src="/path/to/your/logo.png" alt="Logo LimpiezasDuo" className="mx-auto h-12 w-auto mb-4" /> */}
           <h1 className="text-2xl font-heading font-bold text-limpio-dark">
              Área de Gestión
           </h1>
           <p className="mt-1 text-sm text-limpio-gray">
               Inicia sesión para continuar
            </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nombre de Usuario */}
          <div>
            <label htmlFor="nombre_usuario" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Usuario
            </label>
            <input
              id="nombre_usuario"
              name="nombre_usuario"
              type="text"
              autoComplete="username"
              required
              disabled={isLoading} // Deshabilita mientras carga
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-limpio-gold focus:border-limpio-gold sm:text-sm disabled:opacity-70"
              placeholder="Tu nombre de usuario"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isLoading} // Deshabilita mientras carga
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-limpio-gold focus:border-limpio-gold sm:text-sm disabled:opacity-70"
              placeholder="••••••••"
            />
            {/* Podrías añadir un enlace de "¿Olvidaste tu contraseña?" aquí si lo implementas */}
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md border border-red-200" role="alert">
              {error}
            </div>
          )}

          {/* Botón Submit */}
          <div>
            <button
              type="submit"
              disabled={isLoading} // Deshabilita mientras carga
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-limpio-gold hover:bg-limpio-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-limpio-gold disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              {isLoading ? (
                <>
                  {/* <Spinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" /> */}
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>

         {/* Opcional: Enlace para volver a la página pública */}
         <div className="text-center mt-6">
            <Link to="/" className="text-sm text-limpio-gold hover:text-limpio-gold-dark hover:underline">
                ← Volver a la página principal
            </Link>
         </div>

      </div>
    </div>
  );
}

export default LoginPage;